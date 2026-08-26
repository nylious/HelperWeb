import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

    const admin = createAdminClient()

    const form = await request.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Choose an image file.' }, { status: 400 })
    }

    const allowedTypes = new Set([
      'image/png',
      'image/svg+xml',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ])

    const kind = String(form.get('kind') || 'logo')
    if (kind !== 'logo' && kind !== 'header_icon') {
      return NextResponse.json({ ok: false, error: 'Invalid upload target.' }, { status: 400 })
    }

    if (!allowedTypes.has(file.type.toLowerCase())) {
      return NextResponse.json({ ok: false, error: 'Only PNG, SVG, JPG, JPEG and WebP images are supported.' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'Logo must be 5 MB or smaller.' }, { status: 400 })
    }

    const ext =
      (file.name.split('.').pop() || 'png')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'png'

    const fileLabel = kind === 'header_icon' ? 'header-icon' : 'logo'
    const path = `brand/${user.id}/${fileLabel}-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await admin.storage
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

    const { data: publicUrl } = admin.storage
      .from('site-assets')
      .getPublicUrl(path)

    const settingsPatch: {
      id: number
      logo_url?: string
      header_icon_url?: string
    } = kind === 'header_icon'
      ? {
          id: 1,
          header_icon_url: publicUrl.publicUrl,
        }
      : {
          id: 1,
          logo_url: publicUrl.publicUrl,
        }

    const { error: settingsError } = await admin
      .from('site_settings')
      .update(
        kind === 'header_icon'
          ? { header_icon_url: publicUrl.publicUrl }
          : { logo_url: publicUrl.publicUrl }
      )
      .eq('id', 1)

    if (settingsError) {
      throw new Error(
        `Could not save ${kind === 'header_icon' ? 'header icon' : 'logo'} URL: ${settingsError.message}`
      )
    }

    return NextResponse.json({ ok: true, url: publicUrl.publicUrl })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not upload logo.',
    }, { status: 500 })
  }
}
