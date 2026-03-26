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

    const { name, description, website } = await request.json()

    // Update charity
    const { data: updatedCharity, error } = await (supabaseAdmin
      .from('charities')
      .update({
        name,
        description,
        website_url: website, // Fix: map website to website_url
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single() as any)

    if (error) {
      console.error('Error updating charity:', error)
      return NextResponse.json({ message: 'Error updating charity' }, { status: 500 })
    }

    return NextResponse.json({ charity: updatedCharity })

  } catch (error) {
    console.error('Admin update charity error:', error)
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

    // Check if charity is being used by users
    const { data: users, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('selected_charity_id', params.id)
      .limit(1)

    if (checkError) {
      console.error('Error checking charity usage:', checkError)
      return NextResponse.json({ message: 'Error checking charity usage' }, { status: 500 })
    }

    if (users && users.length > 0) {
      return NextResponse.json({ 
        message: 'Cannot delete charity that is selected by users' 
      }, { status: 400 })
    }

    // Delete charity
    const { error } = await supabaseAdmin
      .from('charities')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting charity:', error)
      return NextResponse.json({ message: 'Error deleting charity' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Charity deleted successfully' })

  } catch (error) {
    console.error('Admin delete charity error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}