import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { staticSections } from '@/lib/static-data'

export async function POST() {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 },
      )
    }

    const { data: profile } = await authClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Administrator access required.' },
        { status: 403 },
      )
    }

    const admin = createAdminClient()

    for (const section of staticSections) {
      const { error: sectionError } = await admin.from('sections').upsert(
        {
          id: section.id,
          name: section.name,
          slug: section.slug,
          description: section.description,
          kind: section.kind,
          sort_order: section.sort_order,
        },
        { onConflict: 'slug' },
      )

      if (sectionError) throw sectionError

      for (const category of section.categories) {
        const { error: categoryError } = await admin.from('categories').upsert(
          {
            id: category.id,
            section_id: section.id,
            name: category.name,
            slug: category.slug,
            sort_order: category.sort_order,
          },
          { onConflict: 'section_id,slug' },
        )

        if (categoryError) throw categoryError

        for (const entry of category.entries) {
          const { error: entryError } = await admin.from('entries').upsert(
            {
              id: entry.id,
              category_id: category.id,
              name: entry.name,
              code: entry.code,
              description: entry.description,
              uses_amount: entry.uses_amount,
              variants: entry.variants ?? {},
              levels: entry.levels ?? [],
              sort_order: entry.sort_order,
            },
            { onConflict: 'id' },
          )

          if (entryError) throw entryError
        }
      }
    }

    return NextResponse.json({
      ok: true,
      sections: staticSections.length,
      entries: staticSections.reduce(
        (total, section) =>
          total +
          section.categories.reduce(
            (categoryTotal, category) =>
              categoryTotal + category.entries.length,
            0,
          ),
        0,
      ),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Catalog sync failed.',
      },
      { status: 500 },
    )
  }
}
