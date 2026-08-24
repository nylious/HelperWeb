import { Section, SectionSlug } from './types'
import { createClient } from './supabase/server'

import { staticSections } from './static-data'

const fallback: Section[] = staticSections as unknown as Section[]

export async function getSections(): Promise<Section[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sections')
      .select('id,name,slug,description,kind,sort_order,categories(id,name,slug,sort_order,entries(id,name,code,description,uses_amount,variants,levels,sort_order))')
      .order('sort_order')
    if (error || !data || data.length === 0)
      return fallback

    return data as Section[]
  } catch {
    return fallback
  }
}

export async function getSection(slug: SectionSlug) {
  const all = await getSections()
  return all.find((s) => s.slug === slug) ?? null
}
