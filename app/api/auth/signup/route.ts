import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { hashPassword, generateToken } from '../../../../lib/auth'
import { Database } from '../../../../lib/database.types'

type UserInsert = Database['public']['Tables']['users']['Insert']
type UserRow = Database['public']['Tables']['users']['Row']

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, plan, charityId, charityContribution } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !plan) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    // Validate charity ID if provided
    if (charityId) {
      const { data: charity } = await supabaseAdmin
        .from('charities')
        .select('id')
        .eq('id', charityId)
        .single()

      if (!charity) {
        return NextResponse.json({ message: 'Invalid charity selected' }, { status: 400 })
      }
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Calculate subscription dates
    const startDate = new Date()
    const endDate = new Date()
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Create user data
    const userData: UserInsert = {
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      subscription_status: 'active',
      subscription_plan: plan as 'monthly' | 'yearly',
      subscription_start_date: startDate.toISOString(),
      subscription_end_date: endDate.toISOString(),
      stripe_customer_id: null,
      selected_charity_id: charityId || null,
      charity_contribution_percentage: charityContribution || 10
    }

    // Create user in database
    const { data: user, error } = await (supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single() as any)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ message: 'Failed to create user account' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ message: 'Failed to create user account' }, { status: 500 })
    }

    const userRow = user as UserRow

    // Generate JWT token
    const token = generateToken({
      userId: userRow.id,
      email: userRow.email,
      subscriptionStatus: userRow.subscription_status
    })

    return NextResponse.json({ 
      message: 'Account created successfully',
      token,
      user: {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        subscriptionStatus: userRow.subscription_status,
        subscriptionPlan: userRow.subscription_plan,
        selectedCharityId: userRow.selected_charity_id,
        charityContributionPercentage: userRow.charity_contribution_percentage
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}