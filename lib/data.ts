import { Section, SectionSlug } from './types'
import { createClient } from './supabase/server'
import { staticSections } from './static-data'

const fallback: Section[] = staticSections as unknown as Section[]

const sectionSelect =
  'id,name,slug,description,kind,sort_order,categories(id,name,slug,sort_order,entries(id,name,code,description,uses_amount,variants,levels,sort_order))'

function hasUsableCatalog(data: unknown): data is Section[] {
  if (!Array.isArray(data) || data.length === 0) return false
  return data.some(
    (section) =>
      Array.isArray((section as Section).categories) &&
      (section as Section).categories.length > 0,
  )
}

export async function getSections(): Promise<Section[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sections')
      .select(sectionSelect)
      .order('sort_order')

    if (error) return fallback

    if (!hasUsableCatalog(data)) return fallback

    return data as Section[]
  } catch {
    return fallback
  }
}

export async function getSection(slug: SectionSlug) {
  const all = await getSections()
  return all.find((section) => section.slug === slug) ?? null
}
