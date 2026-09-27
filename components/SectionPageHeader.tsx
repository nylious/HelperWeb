'use client'

import { useLanguage } from '@/components/LanguageSelector'
import type { Section } from '@/lib/types'

const ITEM_TR: Record<string, string> = {
  'ITEM SYSTEMS': 'ITEM SİSTEMLERİ',
  'Item Codes': 'Item Kodları',
  'Generate the same item and weapon command formats used by the original GM Helper.': 'Orijinal GM Helper ile aynı Item ve silah komut formatlarını oluşturun.',
}

export default function SectionPageHeader({ section, items = false }: { section?: Section; items?: boolean }) {
  const { language, translateLabel, translateDescription } = useLanguage()
  const tr = (value: string) => language === 'tr' ? (ITEM_TR[value] ?? value) : value

  if (items) {
    return (
      <div className="hero section-hero">
        <div className="eyebrow">{tr('ITEM SYSTEMS')}</div>
        <h1 className="section-page-title">{tr('Item Codes')}</h1>
        <p>{tr('Generate the same item and weapon command formats used by the original GM Helper.')}</p>
      </div>
    )
  }

  if (!section) return null

  return (
    <div className="hero section-hero">
      <div className="eyebrow">{translateLabel(section.name)}</div>
      <h1 className="section-page-title">{translateLabel(section.name)}</h1>
      <p>{translateDescription(section.description)}</p>
    </div>
  )
}
