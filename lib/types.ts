export type SectionSlug = 'discord' | 'ingame' | 'console' | 'items'

export type VariantMap = Record<string, string>

export interface Entry {
  id: string
  name: string
  code: string
  description: string
  uses_amount: boolean
  variants: VariantMap
  levels: string[]
  sort_order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  section_slug: SectionSlug
  sort_order: number
  entries: Entry[]
}

export interface Section {
  id: string
  name: string
  slug: SectionSlug
  description: string
  kind: string
  sort_order: number
  categories: Category[]
}
