import './globals.css'
import { Command, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Damanhour City GM Helper',
  description: 'Damanhour City Commands / Codes GM Helper',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
            <Link href="/admin/login" className="admin-link"><ShieldCheck size={16} /> Admin</Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">Damanhour City • GM Utility</footer>
      </body>
    </html>
  )
}
