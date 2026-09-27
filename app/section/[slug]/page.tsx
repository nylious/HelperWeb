import { notFound } from 'next/navigation'
import { getSection, getSections } from '@/lib/data'
import CommandBrowser from '@/components/CommandBrowser'
import ItemGenerators from '@/components/ItemGenerators'
import SectionNav from '@/components/SectionNav'
import SectionPageHeader from '@/components/SectionPageHeader'

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (slug === 'items') {
    const itemSection = await getSection('items')
    if (!itemSection) return notFound()

    return (
      <>
        <SectionPageHeader items />
        <SectionNav active="items" sections={(await getSections()).map((item) => item.slug)} />
        <ItemGenerators />
      </>
    )
  }

  const section = await getSection(slug as 'discord' | 'ingame' | 'console')
  if (!section) return notFound()

  return (
    <>
      <SectionPageHeader section={section} />
      <SectionNav active={slug} sections={(await getSections()).map((item) => item.slug)} />
      <CommandBrowser section={section} />
    </>
  )
}
