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

    // Get comprehensive reports
    const [
      usersResult,
      drawsResult,
      winnersResult,
      charitiesResult,
      scoresResult
    ] = await Promise.all([
      // User statistics
      (supabaseAdmin
        .from('users') as any)
        .select('subscription_status, subscription_plan, created_at')
        .order('created_at', { ascending: false }),
      
      // Draw statistics
      (supabaseAdmin
        .from('draws') as any)
        .select('total_prize_pool, created_at, is_published')
        .order('created_at', { ascending: false }),
      
      // Winner statistics
      (supabaseAdmin
        .from('winners') as any)
        .select('prize_amount, verification_status, payment_status, created_at')
        .order('created_at', { ascending: false }),
      
      // Charity contributions
      (supabaseAdmin
        .from('charity_contributions') as any)
        .select('amount, created_at'),
      
      // Score statistics
      (supabaseAdmin
        .from('golf_scores') as any)
        .select('score, created_at')
        .order('created_at', { ascending: false })
    ])

    const users = (usersResult.data as any[]) || []
    const draws = (drawsResult.data as any[]) || []
    const winners = (winnersResult.data as any[]) || []
    const charityContributions = (charitiesResult.data as any[]) || []
    const scores = (scoresResult.data as any[]) || []

    // Calculate statistics
    const totalUsers = users.length
    const activeSubscribers = users.filter(u => u.subscription_status === 'active').length
    const monthlySubscribers = users.filter(u => u.subscription_plan === 'monthly').length
    const yearlySubscribers = users.filter(u => u.subscription_plan === 'yearly').length

    const totalDraws = draws.length
    const publishedDraws = draws.filter(d => d.is_published).length
    const totalPrizePool = draws.reduce((sum, d) => sum + parseFloat(d.total_prize_pool || '0'), 0)

    const totalWinners = winners.length
    const verifiedWinners = winners.filter(w => w.verification_status === 'approved').length
    const paidWinners = winners.filter(w => w.payment_status === 'paid').length
    const totalPrizesPaid = winners
      .filter(w => w.payment_status === 'paid')
      .reduce((sum, w) => sum + parseFloat(w.prize_amount || '0'), 0)

    const totalCharityContributions = charityContributions
      .reduce((sum, c) => sum + parseFloat(c.amount || '0'), 0)

    const totalScores = scores.length
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length 
      : 0

    // Monthly growth data (last 6 months)
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthUsers = users.filter(u => {
        const createdAt = new Date(u.created_at)
        return createdAt >= monthStart && createdAt <= monthEnd
      }).length

      const monthDraws = draws.filter(d => {
        const createdAt = new Date(d.created_at)
        return createdAt >= monthStart && createdAt <= monthEnd
      }).length

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: monthUsers,
        draws: monthDraws
      })
    }

    return NextResponse.json({
      overview: {
        totalUsers,
        activeSubscribers,
        monthlySubscribers,
        yearlySubscribers,
        totalDraws,
        publishedDraws,
        totalPrizePool,
        totalWinners,
        verifiedWinners,
        paidWinners,
        totalPrizesPaid,
        totalCharityContributions,
        totalScores,
        averageScore: Math.round(averageScore * 100) / 100
      },
      monthlyData,
      recentActivity: {
        recentUsers: users.slice(0, 10),
        recentDraws: draws.slice(0, 5),
        recentWinners: winners.slice(0, 10)
      }
    })

  } catch (error) {
    console.error('Admin reports error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}