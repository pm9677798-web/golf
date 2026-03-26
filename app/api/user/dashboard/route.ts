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

    // Get user's latest 5 scores
    const { data: scores } = await (supabaseAdmin
      .from('golf_scores') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5)

    // Get upcoming draw
    const { data: upcomingDraw } = await (supabaseAdmin
      .from('draws') as any)
      .select('*')
      .eq('is_published', false)
      .order('draw_date', { ascending: true })
      .limit(1)
      .single()

    // Get user's winnings
    const { data: winnings } = await (supabaseAdmin
      .from('winners') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Get selected charity info
    const { data: charity } = await (supabaseAdmin
      .from('charities') as any)
      .select('*')
      .eq('id', user.selected_charity_id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        subscriptionStatus: user.subscription_status,
        subscriptionPlan: user.subscription_plan,
        subscriptionEndDate: user.subscription_end_date,
        selectedCharityId: user.selected_charity_id,
        charityContributionPercentage: user.charity_contribution_percentage
      },
      scores: scores || [],
      upcomingDraw,
      winnings: winnings || [],
      charity
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}