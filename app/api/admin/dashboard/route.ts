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
    if (!user || user.email !== 'admin@golfheart.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    // Get total users
    const { count: totalUsers } = await (supabaseAdmin
      .from('users') as any)
      .select('*', { count: 'exact', head: true })

    // Get active subscribers
    const { count: activeSubscribers } = await (supabaseAdmin
      .from('users') as any)
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    // Calculate total prize pool
    const { data: activeUsersData } = await (supabaseAdmin
      .from('users') as any)
      .select('subscription_plan')
      .eq('subscription_status', 'active')

    let totalPrizePool = 0
    if (activeUsersData) {
      (activeUsersData as any[]).forEach(user => {
        if (user.subscription_plan === 'monthly') {
          totalPrizePool += 29.99 * 0.6 // 60% goes to prize pool
        } else if (user.subscription_plan === 'yearly') {
          totalPrizePool += (299.99 / 12) * 0.6 // Monthly equivalent
        }
      })
    }

    // Calculate total charity contributions - SIMPLIFIED
    const totalCharityContributions = 0 // Skip for now to avoid timeout

    // Get pending winners count - SIMPLIFIED
    const { count: pendingWinners } = await (supabaseAdmin
      .from('winners') as any)
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending')

    // Get all users for management - SIMPLIFIED
    const { data: users } = await (supabaseAdmin
      .from('users') as any)
      .select('id, email, first_name, last_name, subscription_status, subscription_plan, created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    // Get recent draws - SIMPLIFIED
    const { data: draws } = await (supabaseAdmin
      .from('draws') as any)
      .select('id, draw_date, draw_type, winning_numbers, is_published, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get winners needing verification - SIMPLIFIED
    const { data: winners } = await (supabaseAdmin
      .from('winners') as any)
      .select(`
        id,
        match_type,
        prize_amount,
        verification_status,
        payment_status,
        created_at,
        users!inner (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    const winnersWithNames = (winners as any[])?.map(winner => ({
      ...winner,
      userName: `${winner.users.first_name} ${winner.users.last_name}`
    })) || []

    const nextDrawDate = new Date()
    nextDrawDate.setMonth(nextDrawDate.getMonth() + 1, 1) // First of next month

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeSubscribers: activeSubscribers || 0,
        totalPrizePool,
        totalCharityContributions,
        pendingWinners: pendingWinners || 0,
        nextDrawDate: nextDrawDate.toISOString()
      },
      users: (users as any[])?.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        subscriptionStatus: user.subscription_status,
        subscriptionPlan: user.subscription_plan,
        createdAt: user.created_at
      })) || [],
      draws: draws || [],
      winners: winnersWithNames
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}