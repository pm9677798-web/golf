import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get all charities from database
    const { data: charities, error } = await supabaseAdmin
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ message: 'Failed to fetch charities' }, { status: 500 })
    }

    return NextResponse.json({
      charities: charities?.map(charity => ({
        id: charity.id,
        name: charity.name,
        description: charity.description,
        imageUrl: charity.image_url,
        websiteUrl: charity.website_url,
        isFeatured: charity.is_featured,
        upcomingEvents: charity.upcoming_events
      })) || []
    })

  } catch (error) {
    console.error('Get charities error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}