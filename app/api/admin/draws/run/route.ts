import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getUserFromToken } from '../../../../../lib/auth'
import { runDraw, processDrawResults } from '../../../../../lib/draw-engine'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.email !== 'admin@golfheart.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const { type, mode = 'final' } = await request.json()

    if (!['random', 'algorithmic', 'smart'].includes(type)) {
      return NextResponse.json({ message: 'Invalid draw type' }, { status: 400 })
    }

    if (!['simulation', 'final'].includes(mode)) {
      return NextResponse.json({ message: 'Invalid draw mode' }, { status: 400 })
    }

    // Run the draw
    const drawResult = await runDraw(type)

    // If simulation mode, return results without saving to database
    if (mode === 'simulation') {
      return NextResponse.json({
        message: 'Draw simulation completed',
        simulation: true,
        draw: {
          winningNumbers: drawResult.winningNumbers,
          totalPrizePool: drawResult.totalPrizePool,
          fiveMatchPool: drawResult.fiveMatchPool,
          fourMatchPool: drawResult.fourMatchPool,
          threeMatchPool: drawResult.threeMatchPool,
          estimatedWinners: 'Simulation - winners not calculated'
        }
      })
    }

    // Final mode - save to database
    const { data: draw, error: drawError } = await (supabaseAdmin
      .from('draws') as any)
      .insert({
        draw_date: new Date().toISOString().split('T')[0],
        draw_type: type,
        winning_numbers: drawResult.winningNumbers,
        total_prize_pool: drawResult.totalPrizePool,
        five_match_pool: drawResult.fiveMatchPool,
        four_match_pool: drawResult.fourMatchPool,
        three_match_pool: drawResult.threeMatchPool,
        jackpot_rollover: drawResult.jackpotRollover,
        is_published: false // Admin needs to publish manually
      })
      .select()
      .single()

    if (drawError || !draw) {
      return NextResponse.json({ message: 'Failed to create draw' }, { status: 500 })
    }

    // Process draw results and create winners - SIMPLIFIED VERSION WITH DEBUGGING
    let winners: any[] = []
    
    try {
      console.log('=== STARTING WINNER PROCESSING ===')
      
      // Get all active users
      const { data: activeUsers, error: usersError } = await (supabaseAdmin
        .from('users') as any)
        .select('id, first_name, last_name, email')
        .eq('subscription_status', 'active')

      if (usersError) {
        console.error('❌ Error fetching users:', usersError)
        return NextResponse.json({ 
          message: 'Error fetching users: ' + usersError.message,
          debug: { usersError }
        }, { status: 500 })
      }

      if (!activeUsers || activeUsers.length === 0) {
        console.log('❌ No active users found')
        return NextResponse.json({
          message: 'No active users found for winner processing',
          debug: { activeUsersCount: 0 }
        }, { status: 400 })
      }

      console.log(`✅ Found ${activeUsers.length} active users`)

      // Check each user for matches
      for (const user of activeUsers) {
        console.log(`\n--- Processing user: ${user.first_name} (${user.email}) ---`)
        
        // Get user's latest 5 scores
        const { data: userScores, error: scoresError } = await (supabaseAdmin
          .from('golf_scores') as any)
          .select('score, score_date')
          .eq('user_id', user.id)
          .order('score_date', { ascending: false })
          .limit(5)

        if (scoresError) {
          console.error(`❌ Error fetching scores for ${user.first_name}:`, scoresError)
          continue
        }

        if (!userScores || userScores.length < 5) {
          console.log(`⚠️ User ${user.first_name} has only ${userScores?.length || 0} scores, needs 5. Skipping.`)
          continue
        }

        const scores = userScores.map(s => s.score)
        console.log(`📊 User ${user.first_name} scores:`, scores)
        console.log(`🎯 Winning numbers:`, drawResult.winningNumbers)

        // Calculate matches
        const matches = scores.filter(score => drawResult.winningNumbers.includes(score)).length
        console.log(`🎲 User ${user.first_name} has ${matches} matches`)

        if (matches >= 3) {
          console.log(`🏆 WINNER FOUND: ${user.first_name} with ${matches} matches!`)
          
          // Create draw entry first
          const { data: entryData, error: entryError } = await (supabaseAdmin
            .from('draw_entries') as any)
            .insert({
              user_id: user.id,
              draw_id: draw.id,
              user_numbers: scores,
              matches: matches,
              prize_amount: 0 // Will be calculated later
            })
            .select()
            .single()

          if (entryError) {
            console.error(`❌ Error creating draw entry for ${user.first_name}:`, entryError)
            continue
          }

          console.log(`✅ Draw entry created for ${user.first_name}`)

          winners.push({
            userId: user.id,
            userName: `${user.first_name} ${user.last_name}`,
            matches: matches,
            matchType: `${matches}-match`
          })
        } else {
          console.log(`❌ User ${user.first_name} has only ${matches} matches (needs 3+)`)
        }
      }

      console.log(`\n=== WINNER PROCESSING COMPLETE ===`)
      console.log(`🏆 Total winners found: ${winners.length}`)
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in winner processing:', error)
      return NextResponse.json({ 
        message: 'Critical error in winner processing: ' + (error as Error).message,
        debug: { error: error }
      }, { status: 500 })
    }

    // Calculate prize amounts for winners
    const winnersByMatch: { [key: number]: any[] } = {}
    winners?.forEach(winner => {
      if (!winnersByMatch[winner.matches]) {
        winnersByMatch[winner.matches] = []
      }
      winnersByMatch[winner.matches].push(winner)
    })

    // Create winner records with proper error handling
    console.log(`Creating winner records for ${winners.length} winners`)
    
    for (const [matches, matchWinners] of Object.entries(winnersByMatch)) {
      const matchCount = parseInt(matches)
      if (matchCount >= 3) {
        let poolAmount = 0
        let matchType = ''

        switch (matchCount) {
          case 5:
            poolAmount = drawResult.fiveMatchPool
            matchType = '5-match'
            break
          case 4:
            poolAmount = drawResult.fourMatchPool
            matchType = '4-match'
            break
          case 3:
            poolAmount = drawResult.threeMatchPool
            matchType = '3-match'
            break
        }

        const prizePerWinner = poolAmount / matchWinners.length
        console.log(`${matchType}: ${matchWinners.length} winners, $${prizePerWinner.toFixed(2)} each`)

        for (const winner of matchWinners) {
          try {
            const { error: winnerError } = await (supabaseAdmin
              .from('winners') as any)
              .insert({
                user_id: winner.userId,
                draw_id: draw.id,
                match_type: matchType,
                prize_amount: prizePerWinner,
                verification_status: 'pending',
                payment_status: 'pending'
              })

            if (winnerError) {
              console.error('Error creating winner record:', winnerError)
            } else {
              console.log(`Created winner record for ${winner.userName}`)
            }
          } catch (error) {
            console.error('Error inserting winner:', error)
          }
        }
      }
    }

    // If no 5-match winners, update jackpot rollover
    if (!winnersByMatch[5] || winnersByMatch[5].length === 0) {
      await (supabaseAdmin
        .from('draws') as any)
        .update({ jackpot_rollover: drawResult.fiveMatchPool })
        .eq('id', draw.id)
    }

    return NextResponse.json({
      message: 'Draw completed successfully',
      simulation: false,
      draw: {
        id: draw.id,
        winningNumbers: drawResult.winningNumbers,
        totalPrizePool: drawResult.totalPrizePool,
        winners: winners?.length || 0,
        winnerDetails: winners.map(w => `${w.userName}: ${w.matches} matches`),
        isPublished: false
      }
    })

  } catch (error) {
    console.error('Run draw error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}