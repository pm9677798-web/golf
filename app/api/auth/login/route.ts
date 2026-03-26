import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { verifyPassword, generateToken } from '../../../../lib/auth'
import { Database } from '../../../../lib/database.types'

type UserRow = Database['public']['Tables']['users']['Row']

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // --- EMERGENCY ADMIN BYPASS (Temporary) ---
    if (email === 'admin@golfheart.com' && password === 'admin123') {
      return NextResponse.json({
        message: 'Login successful (Emergency Access)',
        token: generateToken({
          userId: 'admin-bypass',
          email: 'admin@golfheart.com',
          subscriptionStatus: 'active'
        }),
        isAdmin: true,
        user: { 
          id: 'admin-bypass', 
          email: 'admin@golfheart.com', 
          firstName: 'Admin', 
          lastName: 'User', 
          subscriptionStatus: 'active',
          subscriptionPlan: 'yearly'
        }
      })
    }
    // ----------------------------------------

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    // Find user by email
    const { data: user, error } = await (supabaseAdmin
      .from('users') as any)
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const userRow = user as any

    // Verify password
    const isValidPassword = await verifyPassword(password, userRow.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    // Check subscription status
    if (userRow.subscription_end_date && new Date(userRow.subscription_end_date) < new Date()) {
      const { error: updateError } = await (supabaseAdmin
        .from('users') as any)
        .update({ subscription_status: 'inactive' })
        .eq('id', userRow.id)
      
      if (!updateError) {
        userRow.subscription_status = 'inactive'
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: userRow.id,
      email: userRow.email,
      subscriptionStatus: userRow.subscription_status
    })

    return NextResponse.json({
      message: 'Login successful',
      token,
      isAdmin: userRow.email === 'admin@golfheart.com',
      user: {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        profileImageUrl: userRow.profile_image_url,
        subscriptionStatus: userRow.subscription_status,
        subscriptionPlan: userRow.subscription_plan,
        selectedCharityId: userRow.selected_charity_id,
        charityContributionPercentage: userRow.charity_contribution_percentage
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}