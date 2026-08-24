'use client'

import Link from 'next/link'
import { ArrowLeft, Database, RefreshCw, Settings2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function syncCatalog() {
    setSyncing(true)
    setStatus('')
    setError('')

    try {
      const response = await fetch('/api/admin/sync', { method: 'POST' })
      const result = (await response.json()) as {
        ok?: boolean
        sections?: number
        entries?: number
        error?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Catalog sync failed.')
      }

      setStatus(
        `Catalog synced successfully — ${result.sections} sections / ${result.entries} entries.`,
      )
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Catalog sync failed.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-frame">
        <div className="settings-heading">
          <div>
            <div className="dashboard-kicker">ADMIN / SETTINGS</div>
            <h1>System settings</h1>
            <p>Database health, catalog sync and workspace utilities.</p>
          </div>
          <Link href="/admin" className="ghost-btn">
            <ArrowLeft size={15} />
            Back
          </Link>
        </div>

        <section className="settings-grid">
          <article className="settings-card">
            <div className="settings-card-icon gold">
              <Database size={18} />
            </div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">CATALOG</div>
              <h2>Sync source catalog</h2>
              <p>
                Push the bundled verified catalog into Supabase. This is useful for first-time
                setup or recovering an incomplete database without editing the code manually.
              </p>
            </div>
            <button
              className="primary-btn settings-action"
              onClick={syncCatalog}
              disabled={syncing}
            >
              <RefreshCw size={16} className={syncing ? 'spin' : ''} />
              {syncing ? 'Syncing…' : 'Sync catalog'}
            </button>
            {status && <div className="settings-status success">{status}</div>}
            {error && <div className="settings-status error">{error}</div>}
          </article>

          <article className="settings-card">
            <div className="settings-card-icon green">
              <ShieldCheck size={18} />
            </div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">SECURITY</div>
              <h2>Authentication</h2>
              <p>
                Access is protected by Supabase Authentication and the admin role stored in the
                <code> profiles </code> table.
              </p>
            </div>
            <div className="settings-meta-row">
              <span>Role check</span>
              <strong>profiles.role = admin</strong>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-icon bronze">
              <Settings2 size={18} />
            </div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">DEPLOYMENT</div>
              <h2>Vercel workflow</h2>
              <p>
                GitHub remains the source of code. Vercel redeploys automatically whenever the
                main branch receives a new commit.
              </p>
            </div>
            <div className="settings-meta-row">
              <span>Frontend</span>
              <strong>Next.js / Vercel</strong>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
