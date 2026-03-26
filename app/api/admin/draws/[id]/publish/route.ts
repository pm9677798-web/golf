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

    const drawId = params.id

    // Update draw to published status with proper error handling
    try {
      const updateResult = await (supabaseAdmin
        .from('draws')
        .update({ is_published: true } as any)
        .eq('id', drawId)
        .select()
        .single() as any)

      const draw = updateResult.data

      if (updateResult.error) {
        console.error('Publish error:', updateResult.error)
        return NextResponse.json({ 
          message: 'Failed to publish draw: ' + updateResult.error.message 
        }, { status: 500 })
      }

      if (!draw) {
        return NextResponse.json({ message: 'Draw not found' }, { status: 404 })
      }

      return NextResponse.json({
        message: 'Draw published successfully',
        draw: {
          id: draw.id,
          drawDate: draw.draw_date,
          winningNumbers: draw.winning_numbers,
          totalPrizePool: draw.total_prize_pool,
          isPublished: draw.is_published
        }
      })

    } catch (dbError) {
      console.error('Database error in publish:', dbError)
      return NextResponse.json({ 
        message: 'Database error: ' + (dbError as Error).message 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Publish draw error:', error)
    return NextResponse.json({ 
      message: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 })
  }
}