import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabase'
import { getUserFromToken } from '../../../../../../lib/auth'

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

    const { paymentStatus, paymentMethod, transactionId } = await request.json()

    // Update winner payment status
    const { data: updatedWinner, error } = await (supabaseAdmin
      .from('winners') as any)
      .update({
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        payment_date: paymentStatus === 'paid' ? new Date().toISOString() : null
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating winner payment:', error)
      return NextResponse.json({ message: 'Error updating payment status' }, { status: 500 })
    }

    return NextResponse.json({ winner: updatedWinner })

  } catch (error) {
    console.error('Admin winner payment error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}