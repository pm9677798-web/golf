import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { getUserFromToken } from '../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { score, date } = await request.json()

    // Validate score range (Stableford: 1-45)
    if (score < 1 || score > 45) {
      return NextResponse.json({ message: 'Score must be between 1 and 45' }, { status: 400 })
    }

    // Get current scores count
    const { data: currentScores } = await supabaseAdmin
      .from('golf_scores')
      .select('id')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })

    // If user already has 5 scores, delete the oldest one
    if (currentScores && currentScores.length >= 5) {
      const { data: oldestScore } = await supabaseAdmin
        .from('golf_scores')
        .select('id')
        .eq('user_id', user.id)
        .order('score_date', { ascending: true })
        .limit(1)
        .single()

      if (oldestScore) {
        await supabaseAdmin
          .from('golf_scores')
          .delete()
          .eq('id', oldestScore.id)
      }
    }

    // Add new score
    const { data: newScore, error } = await supabaseAdmin
      .from('golf_scores')
      .insert({
        user_id: user.id,
        score: parseInt(score),
        score_date: date
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ message: 'Failed to add score' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Score added successfully',
      score: newScore
    })

  } catch (error) {
    console.error('Add score error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

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

    const { data: scores } = await supabaseAdmin
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5)

    return NextResponse.json({ scores: scores || [] })

  } catch (error) {
    console.error('Get scores error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}