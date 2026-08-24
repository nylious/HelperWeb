import { notFound } from 'next/navigation'
import { getSection } from '@/lib/data'
import CommandBrowser from '@/components/CommandBrowser'
import ItemGenerators from '@/components/ItemGenerators'
import SectionNav from '@/components/SectionNav'

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (slug === 'items') {
    return (
      <>
        <div className="hero section-hero">
          <div className="eyebrow">ITEM SYSTEMS</div>
          <h1 className="section-page-title">Item Codes</h1>
          <p>Generate the same item and weapon command formats used by the original GM Helper.</p>
        </div>
        <SectionNav active="items" />
        <ItemGenerators />
      </>
    )
  }

  const section = await getSection(slug as 'discord' | 'ingame' | 'console')
  if (!section) return notFound()

  return (
    <>
      <div className="hero section-hero">
        <div className="eyebrow">{section.name}</div>
        <h1 className="section-page-title">{section.name}</h1>
        <p>{section.description}</p>
      </div>
      <SectionNav active={slug} />
      <CommandBrowser section={section} />
    </>
  )
}
