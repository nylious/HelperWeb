import Link from 'next/link'
import { ArrowRight, Bot, Boxes, Terminal, Swords } from 'lucide-react'
import { getSections } from '@/lib/data'

const icons = { discord: Bot, ingame: Terminal, items: Boxes, console: Swords }

export default async function Home() {
  const sections = await getSections()
  const count = sections.reduce((n,s)=>n+s.categories.reduce((m,c)=>m+c.entries.length,0),0)
  return <>
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-card">
          <div className="eyebrow">GM COMMANDS / CODES</div>
          <h1>Everything your GM needs.<br/>One clean place.</h1>
          <p>Fast command lookup, unique spawners, item generators and live data management. Built around the command structure of Damanhour City.</p>
          <div style={{display:'flex',gap:10,marginTop:24,flexWrap:'wrap'}}>
            <Link className="primary-btn" href="/section/console">Open Console Commands <ArrowRight size={16} style={{verticalAlign:'middle'}}/></Link>
            <Link className="ghost-btn" href="/section/discord">Browse Discord</Link>
          </div>
        </div>
        <div className="hero-side">
          <div>
            <div className="eyebrow">LIVE KNOWLEDGE BASE</div>
            <p style={{fontSize:13}}>The website is the source of truth. Admin edits go straight to the database instead of waiting for a new desktop build.</p>
          </div>
          <div>
            <div className="stat"><span className="stat-label">Catalogued entries</span><span className="stat-value">{count || '—'}</span></div>
            <div className="stat"><span className="stat-label">Sections</span><span className="stat-value">4</span></div>
            <div className="stat"><span className="stat-label">Theme</span><span className="stat-value">Dark / Blue</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="section-grid">
      {sections.map(section => {
        const Icon = icons[section.slug]
        const entries = section.categories.reduce((n,c)=>n+c.entries.length,0)
        return <Link key={section.slug} href={section.slug==='items'?'/section/items':`/section/${section.slug}`} className="section-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div style={{width:42,height:42,borderRadius:11,display:'grid',placeItems:'center',background:'rgba(10,142,232,.12)',color:'var(--accent)'}}><Icon size={21}/></div><ArrowRight size={18} color="#64707c"/></div>
          <h2>{section.name}</h2><p>{section.description}</p>
          <div className="section-meta"><span className="pill">{entries || 'Live'}</span><span>{section.categories.length} categories</span></div>
        </Link>
      })}
    </section>
  </>
}
