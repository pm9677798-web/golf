import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabase'
import { getUserFromToken } from '../../../../../../lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.email !== 'admin@golfheart.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const { status } = await request.json()
    const winnerId = params.id

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
    }

    // Update winner verification status
    const { data: winner, error } = await (supabaseAdmin
      .from('winners') as any)
      .update({
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', winnerId)
      .select()
      .single()

    if (error || !winner) {
      return NextResponse.json({ message: 'Failed to update winner' }, { status: 500 })
    }

    // If approved, you might want to trigger payment processing here
    if (status === 'approved') {
      // TODO: Integrate with payment system
      // For now, we'll just mark as ready for payment
    }

    return NextResponse.json({
      message: `Winner ${status} successfully`,
      winner
    })

  } catch (error) {
    console.error('Verify winner error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}