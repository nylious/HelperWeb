import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getSections } from '@/lib/data'
import { getSiteSettings } from '@/lib/site-settings'

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
              <Link className="primary-btn" href="/section/console">
                {site.primary_button_label} <ArrowRight size={16} />
              </Link>
              <Link className="ghost-btn" href="/section/discord">
                {site.secondary_button_label}
              </Link>
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
              <div className="stat"><span className="stat-label">Theme</span><span className="stat-value">Gold / Black</span></div>
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
