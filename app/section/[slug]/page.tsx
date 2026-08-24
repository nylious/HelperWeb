import { notFound } from 'next/navigation'
import { getSection } from '@/lib/data'
import CommandBrowser from '@/components/CommandBrowser'
import ItemGenerators from '@/components/ItemGenerators'
import Link from 'next/link'

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug === 'items') {
    return <><div className="hero" style={{paddingBottom:0}}><div className="eyebrow">ITEM SYSTEMS</div><h1 style={{fontSize:46,marginTop:12}}>Item Codes</h1><p>Generate the same item and weapon command formats used by the original GM Helper.</p><div style={{marginTop:14}}><Link className="ghost-btn" href="/">← Home</Link></div></div><ItemGenerators/></>
  }
  const section = await getSection(slug as any)
  if (!section) return notFound()
  return <><div className="hero" style={{paddingBottom:6}}><div className="eyebrow">{section.name}</div><h1 style={{fontSize:46,marginTop:12}}>{section.name}</h1><p>{section.description}</p></div><CommandBrowser section={section}/></>
}
