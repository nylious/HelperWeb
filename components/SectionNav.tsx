'use client'

import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/components/LanguageSelector'

const sectionLinks = [
  { slug: 'console', label: 'Console Commands' },
  { slug: 'discord', label: 'Discord Commands' },
  { slug: 'ingame', label: 'In-game Commands' },
  { slug: 'items', label: 'Item Codes' },
]

export default function SectionNav({ active, sections: visibleSlugs }: { active?: string; sections?: string[] }) {
  const { language, translateLabel } = useLanguage()
  const back = language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'

  return (
    <div className="helper-section-nav helper-section-nav-below-hero">
      <div className="helper-nav-row">
        <Link href="/" className="helper-back-btn">
          <ArrowLeft size={15} />
          {back}
        </Link>

        <div className="helper-shortcuts" aria-label="Helper sections">
          {sectionLinks.filter((section) => !visibleSlugs || visibleSlugs.includes(section.slug)).map((section) => (
            <Link
              key={section.slug}
              href={`/section/${section.slug}`}
              className={`helper-shortcut ${active === section.slug ? 'active' : ''}`}
            >
              <span>{translateLabel(section.label)}</span>
              <ChevronRight size={13} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
