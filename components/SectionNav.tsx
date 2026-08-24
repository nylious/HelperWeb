import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const sections = [
  { slug: 'console', label: 'Console Commands' },
  { slug: 'discord', label: 'Discord Commands' },
  { slug: 'ingame', label: 'In-game Commands' },
  { slug: 'items', label: 'Item Codes' },
]

export default function SectionNav({ active }: { active?: string }) {
  return (
    <div className="helper-section-nav helper-section-nav-below-hero">
      <div className="helper-nav-row">
        <Link href="/" className="helper-back-btn">
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        <div className="helper-shortcuts" aria-label="Helper sections">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/section/${section.slug}`}
              className={`helper-shortcut ${active === section.slug ? 'active' : ''}`}
            >
              <span>{section.label}</span>
              <ChevronRight size={13} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
