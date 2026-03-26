import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { getUserFromToken } from '../../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ message: 'No image file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        message: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Delete old profile image if exists
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('profile_image_url')
      .eq('id', user.id)
      .single()

    if (currentUser?.profile_image_url) {
      // Extract filename from URL and delete from storage
      const oldFileName = currentUser.profile_image_url.split('/').pop()
      if (oldFileName) {
        await supabaseAdmin.storage
          .from('profile-images')
          .remove([`${user.id}/${oldFileName}`])
      }
    }

    // Upload new image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('profile-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // Update user profile with new image URL
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        profile_image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Profile image updated successfully',
      imageUrl: imageUrl
    })

  } catch (error) {
    console.error('Profile image upload error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Get current profile image
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('profile_image_url')
      .eq('id', user.id)
      .single()

    if (!currentUser?.profile_image_url) {
      return NextResponse.json({ message: 'No profile image to delete' }, { status: 400 })
    }

    // Extract filename from URL and delete from storage
    const fileName = currentUser.profile_image_url.split('/').slice(-2).join('/')
    
    const { error: deleteError } = await supabaseAdmin.storage
      .from('profile-images')
      .remove([fileName])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
    }

    // Remove image URL from user profile
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        profile_image_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Profile image deleted successfully'
    })

  } catch (error) {
    console.error('Profile image delete error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}