'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/LanguageSelector'
import type { ReactNode } from 'react'
import type { Section } from '@/lib/types'
import type { SiteSettings } from '@/lib/site-settings'

function CtaLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const external = /^https?:\/\//i.test(href)
  if (external) return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>
  return <Link className={className} href={href || '/'}>{children}</Link>
}

const HOME_TR: Record<string, string> = {
  'GM COMMANDS / CODES': 'GM KOMUTLARI / KODLARI',
  'Everything your GM needs.': 'GM\'inizin ihtiyaç duyduğu her şey.',
  'One clean place.': 'Her şey tek bir yerde.',
  'Fast command lookup, unique spawners and item generators — organized exactly around the Damanhour City GM workflow.': 'Hızlı komut arama, Unique oluşturucuları ve Item generator araçları, Damanhour City GM iş akışına göre düzenlendi.',
  'LIVE KNOWLEDGE BASE': 'CANLI BİLGİ TABANI',
  'One live catalog for the GM team. Admin changes are reflected from the central database instead of waiting for a desktop rebuild.': 'GM ekibi için canlı bir katalog. Admin değişiklikleri yeni bir masaüstü sürümünü beklemeden merkezi veritabanından yansıtılır.',
  'Open Console Commands': 'Konsol Komutlarını Aç',
  'Browse Discord': 'Discord Komutlarına Göz At',
  'Catalogued entries': 'Katalogdaki komutlar',
  'Sections': 'Bölümler',
  'Theme': 'Tema',
  'Gold / Black': 'Altın / Siyah',
  'categories': 'kategori',
}

export default function HomeContent({ sections, site }: { sections: Section[]; site: SiteSettings }) {
  const { language, translateLabel } = useLanguage()
  const tr = (value: string) => language === 'tr' ? (HOME_TR[value] ?? translateLabel(value)) : value

  const count = sections.reduce(
    (n, section) => n + section.categories.reduce((m, c) => m + c.entries.length, 0),
    0,
  )

  return (
    <>
      <section className="hero home-hero">
        <div className="home-logo-stage">
          <div className="home-logo-ring" />
          <div className="home-logo-glow" />
          <div className="home-logo-card" title="Damanhour City">
            <img src={site.logo_url || '/brand-mark.svg'} alt="Damanhour City logo" className="home-logo-image" />
          </div>
          <div className="home-logo-wordmark">DAMANHOUR CITY</div>
          <div className="home-logo-caption">COMMANDS / CODES GM HELPER</div>
        </div>

        <div className="hero-grid home-hero-grid">
          <div className="hero-card home-copy-card">
            <div className="eyebrow">{tr(site.hero_overline)}</div>
            <h1>
              {tr(site.hero_title_line1)}
              <br />
              {tr(site.hero_title_line2)}
              {site.hero_title_line3 && <><br />{tr(site.hero_title_line3)}</>}
            </h1>
            <p>{tr(site.hero_description)}</p>
            <div className="home-actions">
              <CtaLink className="primary-btn" href={site.primary_button_href}>
                {tr(site.primary_button_label)} <ArrowRight size={16} />
              </CtaLink>
              <CtaLink className="ghost-btn" href={site.secondary_button_href}>
                {tr(site.secondary_button_label)}
              </CtaLink>
            </div>
          </div>

          <div className="hero-side home-live-card">
            <div>
              <div className="eyebrow">{tr(site.live_title)}</div>
              <p>{tr(site.live_description)}</p>
            </div>
            <div>
              <div className="stat"><span className="stat-label">{tr('Catalogued entries')}</span><span className="stat-value">{count || '—'}</span></div>
              <div className="stat"><span className="stat-label">{tr('Sections')}</span><span className="stat-value">{sections.length}</span></div>
              <div className="stat"><span className="stat-label">{tr('Theme')}</span><span className="stat-value">{tr('Gold / Black')}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-grid">
        {sections.map((section) => {
          const entries = section.categories.reduce((n, c) => n + c.entries.length, 0)
          return (
            <Link
              key={section.slug}
              href={section.slug === 'items' ? '/section/items' : `/section/${section.slug}`}
              className="section-card"
            >
              <div className="section-card-top">
                <div className="section-card-mark">{section.name.slice(0, 1)}</div>
                <ArrowRight size={18} />
              </div>
              <h2>{translateLabel(section.name)}</h2>
              <p>{tr(section.description)}</p>
              <div className="section-meta"><span className="pill">{entries || 'Live'}</span><span>{section.categories.length} {tr('categories')}</span></div>
            </Link>
          )
        })}
      </section>
    </>
  )
}
