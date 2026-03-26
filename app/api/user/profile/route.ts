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

    // Get user profile with charity info
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        charities (
          id,
          name,
          description
        )
      `)
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      profile: {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        profileImageUrl: profile.profile_image_url,
        subscriptionStatus: profile.subscription_status,
        subscriptionPlan: profile.subscription_plan,
        subscriptionStartDate: profile.subscription_start_date,
        subscriptionEndDate: profile.subscription_end_date,
        selectedCharityId: profile.selected_charity_id,
        charityContributionPercentage: profile.charity_contribution_percentage,
        charity: profile.charities
      }
    })

  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { firstName, lastName, selectedCharityId, charityContributionPercentage } = await request.json()

    // Update user profile
    const { data: updatedUser, error } = await (supabaseAdmin
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        selected_charity_id: selectedCharityId,
        charity_contribution_percentage: charityContributionPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single() as any)

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ message: 'Error updating profile' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        selectedCharityId: updatedUser.selected_charity_id,
        charityContributionPercentage: updatedUser.charity_contribution_percentage
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}