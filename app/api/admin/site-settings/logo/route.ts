import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Admin access required.' }, { status: 403 })
    }

    const form = await request.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Choose an image file.' }, { status: 400 })
    }

    const allowedTypes = new Set([
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ])

    if (!allowedTypes.has(file.type.toLowerCase())) {
      return NextResponse.json({ ok: false, error: 'Only PNG, JPG, JPEG and WebP logos are supported.' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'Logo must be 5 MB or smaller.' }, { status: 400 })
    }

    const ext =
      (file.name.split('.').pop() || 'png')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'png'

    const path = `brand/${user.id}/logo-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, bytes, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })

    if (uploadError) {
      throw new Error(
        `Storage upload failed: ${uploadError.message}`
      )
    }

    const { data: publicUrl } = supabase.storage
      .from('site-assets')
      .getPublicUrl(path)

    const { error: settingsError } = await supabase
      .from('site_settings')
      .upsert(
        { id: 1, logo_url: publicUrl.publicUrl },
        { onConflict: 'id' },
      )

    if (settingsError) throw settingsError

    return NextResponse.json({ ok: true, url: publicUrl.publicUrl })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not upload logo.',
    }, { status: 500 })
  }
}
