import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getUserFromToken } from '../../../../../lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.email !== 'admin@golfheart.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const { firstName, lastName, subscriptionPlan, subscriptionStatus } = await request.json()

    // Update user
    const { data: updatedUser, error } = await (supabaseAdmin
      .from('users') as any)
      .update({
        first_name: firstName,
        last_name: lastName,
        subscription_plan: subscriptionPlan,
        subscription_status: subscriptionStatus
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 })
    }

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.email !== 'admin@golfheart.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    // Delete user (this will cascade delete related records)
    const { error } = await (supabaseAdmin
      .from('users') as any)
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json({ message: 'Error deleting user' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })

  } catch (error) {
    console.error('Admin delete user error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}