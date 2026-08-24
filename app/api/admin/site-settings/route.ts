import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizeHref(value: unknown) {
  const raw = String(value ?? '').trim()
  if (!raw) return '/'
  if (raw.startsWith('/')) return raw
  try {
    const url = new URL(raw)
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString()
  } catch {}
  return '/'
}

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return profile?.role === 'admin' ? supabase : null
}

export async function GET() {
  try {
    const supabase = await getAdminClient()
    if (!supabase) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({ ok: true, settings: data })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not load settings.',
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getAdminClient()
    if (!supabase) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })

    const payload = await request.json()
    const allowed = {
      logo_url: String(payload.logo_url ?? '').trim(),
      hero_overline: String(payload.hero_overline ?? '').trim(),
      hero_title_line1: String(payload.hero_title_line1 ?? '').trim(),
      hero_title_line2: String(payload.hero_title_line2 ?? '').trim(),
      hero_title_line3: String(payload.hero_title_line3 ?? '').trim(),
      hero_description: String(payload.hero_description ?? '').trim(),
      live_title: String(payload.live_title ?? '').trim(),
      live_description: String(payload.live_description ?? '').trim(),
      primary_button_label: String(payload.primary_button_label ?? '').trim(),
      secondary_button_label: String(payload.secondary_button_label ?? '').trim(),
      primary_button_href: normalizeHref(payload.primary_button_href),
      secondary_button_href: normalizeHref(payload.secondary_button_href),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...allowed }, { onConflict: 'id' })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, settings: data })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not save settings.',
    }, { status: 500 })
  }
}
