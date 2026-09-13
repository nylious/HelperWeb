import { Section, SectionSlug } from './types'
import { createClient } from './supabase/server'
import { staticSections } from './static-data'

const fallback: Section[] = (staticSections as unknown as Section[]).map((section) => ({
  ...section,
  is_visible: section.is_visible ?? true,
  categories: section.categories.map((category) => ({
    ...category,
    entries: category.entries.map((entry) => ({
      ...entry,
      is_visible: entry.is_visible ?? true,
    })),
  })),
}))

const sectionSelect =
  'id,name,slug,description,kind,sort_order,is_visible,categories(id,name,slug,sort_order,entries(id,name,code,description,uses_amount,variants,levels,sort_order,is_visible))'

function hasUsableCatalog(data: unknown): data is Section[] {
  if (!Array.isArray(data) || data.length === 0) return false
  return data.some(
    (section) =>
      Array.isArray((section as Section).categories) &&
      (section as Section).categories.length > 0,
  )
}

export async function getSections(includeHidden = false): Promise<Section[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sections')
      .select(sectionSelect)
      .order('sort_order')

    if (error) return includeHidden ? fallback : fallback.filter((section) => section.is_visible)

    if (!hasUsableCatalog(data)) {
      return includeHidden ? fallback : fallback.filter((section) => section.is_visible)
    }

    const normalized = (data as Section[]).map((section) => ({
      ...section,
      is_visible: section.is_visible !== false,
      categories: (section.categories ?? []).map((category) => ({
        ...category,
        entries: (category.entries ?? []).map((entry) => ({
          ...entry,
          is_visible: entry.is_visible !== false,
        })),
      })),
    }))

    if (includeHidden) return normalized

    return normalized
      .filter((section) => section.is_visible)
      .map((section) => ({
        ...section,
        categories: section.categories
          .map((category) => ({
            ...category,
            entries: category.entries.filter((entry) => entry.is_visible),
          }))
          .filter((category) => category.entries.length > 0),
      }))
      .filter((section) => section.categories.length > 0)
  } catch {
    return includeHidden ? fallback : fallback.filter((section) => section.is_visible)
  }
}

export async function getSection(slug: SectionSlug) {
  const all = await getSections(false)
  return all.find((section) => section.slug === slug) ?? null
}
