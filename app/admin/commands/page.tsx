import { getSections } from '@/lib/data'
import AdminCommandEditor from '@/components/AdminCommandEditor'

export default async function AdminCommands({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; category?: string }>
}) {
  const params = await searchParams
  const sections = await getSections()

  return (
    <div className="admin-shell">
      <AdminCommandEditor
        sections={sections}
        initialSection={params.section}
        initialCategory={params.category}
      />
    </div>
  )
}
