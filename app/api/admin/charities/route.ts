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

    // Get all charities - SIMPLIFIED to avoid timeout
    const { data: charities, error } = await supabaseAdmin
      .from('charities')
      .select('id, name, description, website_url, is_featured, created_at')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching charities:', error)
      return NextResponse.json({ message: 'Error fetching charities' }, { status: 500 })
    }

    return NextResponse.json({ charities })

  } catch (error) {
    console.error('Admin charities error:', error)
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

    const { name, description, website, category } = await request.json()

    // Create new charity
    const { data: newCharity, error } = await (supabaseAdmin
      .from('charities')
      .insert({
        name,
        description,
        website_url: website, // Fix: map website to website_url
        // Note: category field doesn't exist in schema, removing it
      })
      .select()
      .single() as any)

    if (error) {
      console.error('Error creating charity:', error)
      return NextResponse.json({ message: 'Error creating charity' }, { status: 500 })
    }

    return NextResponse.json({ charity: newCharity })

  } catch (error) {
    console.error('Admin create charity error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}