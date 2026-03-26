import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { getUserFromToken, hashPassword } from '../../../../lib/auth'

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

    // Get all users with their scores count
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        scores:golf_scores(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 })
    }

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

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

    const { email, firstName, lastName, subscriptionPlan, subscriptionStatus } = await request.json()

    // Generate a temporary password and hash it
    const tempPassword = 'TempPass123!'
    const hashedPassword = await hashPassword(tempPassword)

    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        subscription_plan: subscriptionPlan,
        subscription_status: subscriptionStatus,
        password_hash: hashedPassword,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionPlan === 'monthly' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ message: 'Error creating user' }, { status: 500 })
    }

    return NextResponse.json({ 
      user: newUser,
      tempPassword: tempPassword,
      message: 'User created successfully. Temporary password: ' + tempPassword
    })

  } catch (error) {
    console.error('Admin create user error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}