import './globals.css'
import { Command, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminAccountMenu from '@/components/AdminAccountMenu'

export const metadata = {
  title: 'Damanhour City GM Helper',
  description: 'Damanhour City Commands / Codes GM Helper — live GM knowledge base.',
  icons: { icon: '/favicon.svg' },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let email = ''
  let displayName = ''
  let isAdmin = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      email = user.email ?? ''
      const { data: profile } = await supabase.from('profiles').select('role,display_name').eq('id', user.id).maybeSingle()
      isAdmin = profile?.role === 'admin'
      displayName = (profile?.display_name ?? '').trim()
    }
  } catch {
    // Public pages remain available even if optional admin session metadata is unavailable.
  }

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="brand">
              <div className="brand-mark"><Command size={18} /></div>
              <div>
                <div className="brand-title">DAMANHOUR CITY</div>
                <div className="brand-subtitle">Commands / Codes GM Helper</div>
              </div>
            </Link>
            <AdminAccountMenu email={email} displayName={displayName} isAdmin={isAdmin} />
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">Damanhour City • GM Utility</footer>
      </body>
    </html>
  )
}
