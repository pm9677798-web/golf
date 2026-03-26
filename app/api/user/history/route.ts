import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { getUserFromToken } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Get user's draw participation history
    const { data: drawEntries } = await supabaseAdmin
      .from('draw_entries')
      .select(`
        *,
        draws (
          id,
          draw_date,
          draw_type,
          winning_numbers,
          is_published,
          total_prize_pool
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Get user's complete score history
    const { data: allScores } = await supabaseAdmin
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })

    // Get user's winnings history
    const { data: winningsHistory } = await supabaseAdmin
      .from('winners')
      .select(`
        *,
        draws (
          draw_date,
          winning_numbers,
          total_prize_pool
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Calculate statistics
    const totalDrawsParticipated = drawEntries?.length || 0
    const totalWinnings = winningsHistory?.reduce((sum, win) => sum + parseFloat(win.prize_amount.toString()), 0) || 0
    const totalScoresEntered = allScores?.length || 0
    const averageScore = allScores?.length > 0 
      ? allScores.reduce((sum, score) => sum + score.score, 0) / allScores.length 
      : 0

    return NextResponse.json({
      drawEntries: drawEntries?.map(entry => ({
        id: entry.id,
        drawId: entry.draw_id,
        userNumbers: entry.user_numbers,
        matches: entry.matches,
        prizeAmount: entry.prize_amount,
        createdAt: entry.created_at,
        draw: {
          id: entry.draws.id,
          drawDate: entry.draws.draw_date,
          drawType: entry.draws.draw_type,
          winningNumbers: entry.draws.winning_numbers,
          isPublished: entry.draws.is_published,
          totalPrizePool: entry.draws.total_prize_pool
        }
      })) || [],
      allScores: allScores?.map(score => ({
        id: score.id,
        score: score.score,
        scoreDate: score.score_date,
        createdAt: score.created_at
      })) || [],
      winningsHistory: winningsHistory?.map(win => ({
        id: win.id,
        matchType: win.match_type,
        prizeAmount: win.prize_amount,
        verificationStatus: win.verification_status,
        paymentStatus: win.payment_status,
        createdAt: win.created_at,
        draw: {
          drawDate: win.draws.draw_date,
          winningNumbers: win.draws.winning_numbers,
          totalPrizePool: win.draws.total_prize_pool
        }
      })) || [],
      statistics: {
        totalDrawsParticipated,
        totalWinnings,
        totalScoresEntered,
        averageScore: Math.round(averageScore * 100) / 100
      }
    })

  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}