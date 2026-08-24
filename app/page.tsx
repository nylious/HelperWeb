import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getSections } from '@/lib/data'
import { getSiteSettings } from '@/lib/site-settings'

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const external = /^https?:\/\//i.test(href)
  if (external) return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>
  return <Link className={className} href={href || '/'}>{children}</Link>
}

export default async function Home() {
  const [sections, site] = await Promise.all([getSections(), getSiteSettings()])
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
            <div className="eyebrow">{site.hero_overline}</div>
            <h1>
              {site.hero_title_line1}
              <br />
              {site.hero_title_line2}
              {site.hero_title_line3 && (
                <>
                  <br />
                  {site.hero_title_line3}
                </>
              )}
            </h1>
            <p>{site.hero_description}</p>
            <div className="home-actions">
              <CtaLink className="primary-btn" href={site.primary_button_href}>
                {site.primary_button_label} <ArrowRight size={16} />
              </CtaLink>
              <CtaLink className="ghost-btn" href={site.secondary_button_href}>
                {site.secondary_button_label}
              </CtaLink>
            </div>
          </div>

          <div className="hero-side home-live-card">
            <div>
              <div className="eyebrow">{site.live_title}</div>
              <p>{site.live_description}</p>
            </div>
            <div>
              <div className="stat"><span className="stat-label">Catalogued entries</span><span className="stat-value">{count || '—'}</span></div>
              <div className="stat"><span className="stat-label">Sections</span><span className="stat-value">{sections.length}</span></div>
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
              <h2>{section.name}</h2>
              <p>{section.description}</p>
              <div className="section-meta"><span className="pill">{entries || 'Live'}</span><span>{section.categories.length} categories</span></div>
            </Link>
          )
        })}
      </section>
    </>
  )
}
