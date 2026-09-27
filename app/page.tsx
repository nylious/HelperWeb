import { getSections } from '@/lib/data'
import { getSiteSettings } from '@/lib/site-settings'
import HomeContent from '@/components/HomeContent'

export default async function Home() {
  const [sections, site] = await Promise.all([getSections(), getSiteSettings()])
  return <HomeContent sections={sections} site={site} />
}
