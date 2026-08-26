import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type SiteSettings = {
  id: number
  logo_url: string
  header_icon_url: string
  hero_overline: string
  hero_title_line1: string
  hero_title_line2: string
  hero_title_line3: string
  hero_description: string
  live_title: string
  live_description: string
  primary_button_label: string
  secondary_button_label: string
  primary_button_href: string
  secondary_button_href: string
  updated_at?: string
}

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  logo_url: '/brand-mark.svg',
  header_icon_url: '/brand-mark.svg',
  hero_overline: 'GM COMMANDS / CODES',
  hero_title_line1: 'Everything your GM needs.',
  hero_title_line2: 'One clean place.',
  hero_title_line3: '',
  hero_description:
    'Fast command lookup, unique spawners and item generators — organized exactly around the Damanhour City GM workflow.',
  live_title: 'LIVE KNOWLEDGE BASE',
  live_description:
    'One live catalog for the GM team. Admin changes are reflected from the central database instead of waiting for a desktop rebuild.',
  primary_button_label: 'Open Console Commands',
  secondary_button_label: 'Browse Discord',
  primary_button_href: '/section/console',
  secondary_button_href: '/section/discord',
  updated_at: '',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('site_settings')
      .select(
        'id,logo_url,header_icon_url,hero_overline,hero_title_line1,hero_title_line2,hero_title_line3,hero_description,live_title,live_description,primary_button_label,secondary_button_label,primary_button_href,secondary_button_href,updated_at',
      )
      .eq('id', 1)
      .maybeSingle()

    if (!error && data) {
      return {
        ...defaultSiteSettings,
        ...(data as Partial<SiteSettings>),
      }
    }
  } catch {
    // Fall through to the authenticated/public server client.
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select(
        'id,logo_url,header_icon_url,hero_overline,hero_title_line1,hero_title_line2,hero_title_line3,hero_description,live_title,live_description,primary_button_label,secondary_button_label,primary_button_href,secondary_button_href,updated_at',
      )
      .eq('id', 1)
      .maybeSingle()

    if (error || !data) return defaultSiteSettings

    return {
      ...defaultSiteSettings,
      ...(data as Partial<SiteSettings>),
    }
  } catch {
    return defaultSiteSettings
  }
}
