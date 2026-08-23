import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is missing.'
    )
  }

  if (!key) {
    throw new Error(
      'Supabase public key is missing. Add NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel.'
    )
  }

  return createBrowserClient(
    url,
    key
  )
}
