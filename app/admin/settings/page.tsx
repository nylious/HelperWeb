'use client'

import Link from 'next/link'
import { ArrowLeft, Database, ImagePlus, RefreshCw, Save, Settings2, ShieldCheck, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

type SiteForm = {
  logo_url: string
  hero_overline: string
  hero_title_line1: string
  hero_title_line2: string
  hero_title_line3: string
  hero_description: string
  live_title: string
  live_description: string
  primary_button_label: string
  secondary_button_label: string
}

const initialForm: SiteForm = {
  logo_url: '/brand-mark.svg',
  hero_overline: '',
  hero_title_line1: '',
  hero_title_line2: '',
  hero_title_line3: '',
  hero_description: '',
  live_title: '',
  live_description: '',
  primary_button_label: '',
  secondary_button_label: '',
}

export default function SettingsPage() {
  const [syncing, setSyncing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState<SiteForm>(initialForm)

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const response = await fetch('/api/admin/site-settings', { cache: 'no-store' })
      const result = (await response.json()) as { ok?: boolean; settings?: SiteForm; error?: string }
      if (!response.ok || !result.ok || !result.settings) throw new Error(result.error || 'Could not load site settings.')
      setForm({ ...initialForm, ...result.settings })
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Could not load site settings.')
    }
  }

  function patch(key: keyof SiteForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function saveSiteSettings() {
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = (await response.json()) as { ok?: boolean; settings?: SiteForm; error?: string }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Could not save home settings.')
      if (result.settings) setForm({ ...initialForm, ...result.settings })
      setStatus('Home page settings saved successfully.')
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Could not save home settings.')
    } finally {
      setSaving(false)
    }
  }

  async function uploadLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setStatus('')
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/site-settings/logo', {
        method: 'POST',
        body: formData,
      })
      const result = (await response.json()) as { ok?: boolean; url?: string; error?: string }
      if (!response.ok || !result.ok || !result.url) throw new Error(result.error || 'Could not upload logo.')
      setForm((current) => ({ ...current, logo_url: result.url! }))
      setStatus('Logo uploaded successfully. Save home settings to keep it as the active logo.')
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Could not upload logo.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  async function syncCatalog() {
    setSyncing(true)
    setStatus('')
    setError('')
    try {
      const response = await fetch('/api/admin/sync', { method: 'POST' })
      const result = (await response.json()) as { ok?: boolean; sections?: number; entries?: number; error?: string }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Catalog sync failed.')
      setStatus(`Catalog synced successfully — ${result.sections} sections / ${result.entries} entries.`)
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
            <h1>Control center settings</h1>
            <p>Update the live catalog, homepage identity and administrator workspace without touching the code.</p>
          </div>
          <Link href="/admin" className="ghost-btn"><ArrowLeft size={15} /> Back</Link>
        </div>

        <section className="settings-grid settings-grid-v2">
          <article className="settings-card settings-card-wide">
            <div className="settings-card-icon gold"><ImagePlus size={18} /></div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">HOME IDENTITY</div>
              <h2>Logo & homepage text</h2>
              <p>Everything below is stored in Supabase. You can change the public homepage without a code edit.</p>
            </div>

            <div className="site-settings-layout">
              <div className="site-preview-column">
                <div className="home-settings-preview">
                  <div className="home-logo-card home-logo-card-preview">
                    <img src={form.logo_url || '/brand-mark.svg'} alt="Current logo" className="home-logo-image" />
                  </div>
                  <strong>DAMAHOUR CITY</strong>
                  <span>Live homepage logo</span>
                </div>
                <label className="upload-logo-btn">
                  <Upload size={15} />
                  {uploading ? 'Uploading…' : 'Upload new logo'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={uploadLogo} hidden />
                </label>
                <div className="upload-help">PNG, JPG, JPEG or WebP · maximum 5 MB</div>
                <label className="settings-input-block">
                  <span>LOGO URL</span>
                  <input value={form.logo_url} onChange={(e) => patch('logo_url', e.target.value)} placeholder="/brand-mark.svg or Supabase public URL" />
                </label>
              </div>

              <div className="site-copy-fields">
                <div className="settings-form-grid">
                  <label className="settings-input-block"><span>OVERLINE</span><input value={form.hero_overline} onChange={(e) => patch('hero_overline', e.target.value)} /></label>
                  <label className="settings-input-block"><span>LIVE CARD TITLE</span><input value={form.live_title} onChange={(e) => patch('live_title', e.target.value)} /></label>
                  <label className="settings-input-block"><span>TITLE LINE 1</span><input value={form.hero_title_line1} onChange={(e) => patch('hero_title_line1', e.target.value)} /></label>
                  <label className="settings-input-block"><span>TITLE LINE 2</span><input value={form.hero_title_line2} onChange={(e) => patch('hero_title_line2', e.target.value)} /></label>
                  <label className="settings-input-block"><span>TITLE LINE 3 (OPTIONAL)</span><input value={form.hero_title_line3} onChange={(e) => patch('hero_title_line3', e.target.value)} /></label>
                  <label className="settings-input-block"><span>PRIMARY BUTTON</span><input value={form.primary_button_label} onChange={(e) => patch('primary_button_label', e.target.value)} /></label>
                  <label className="settings-input-block"><span>SECONDARY BUTTON</span><input value={form.secondary_button_label} onChange={(e) => patch('secondary_button_label', e.target.value)} /></label>
                  <label className="settings-input-block full"><span>HERO DESCRIPTION</span><textarea value={form.hero_description} onChange={(e) => patch('hero_description', e.target.value)} /></label>
                  <label className="settings-input-block full"><span>LIVE CARD DESCRIPTION</span><textarea value={form.live_description} onChange={(e) => patch('live_description', e.target.value)} /></label>
                </div>

                <button className="primary-btn settings-save-site" onClick={saveSiteSettings} disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save homepage settings'}
                </button>
              </div>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-icon green"><Database size={18} /></div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">CATALOG</div>
              <h2>Sync source catalog</h2>
              <p>Push the verified bundled catalog into Supabase for first-time setup or recovery.</p>
            </div>
            <button className="primary-btn settings-action" onClick={syncCatalog} disabled={syncing}>
              <RefreshCw size={16} className={syncing ? 'spin' : ''} />
              {syncing ? 'Syncing…' : 'Sync catalog'}
            </button>
          </article>

          <article className="settings-card">
            <div className="settings-card-icon green"><ShieldCheck size={18} /></div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">SECURITY</div>
              <h2>Session policy</h2>
              <p>Admin sessions automatically sign out after 15 minutes without activity. Remember Me keeps the browser session across restarts.</p>
            </div>
            <div className="settings-meta-row"><span>Idle timeout</span><strong>15 minutes</strong></div>
          </article>

          <article className="settings-card">
            <div className="settings-card-icon bronze"><Settings2 size={18} /></div>
            <div className="settings-card-copy">
              <div className="dashboard-kicker">DEPLOYMENT</div>
              <h2>Vercel workflow</h2>
              <p>GitHub remains the source of code. Vercel redeploys automatically when main receives a new commit.</p>
            </div>
            <div className="settings-meta-row"><span>Frontend</span><strong>Next.js / Vercel</strong></div>
          </article>
        </section>

        {status && <div className="settings-status success global-settings-status">{status}</div>}
        {error && <div className="settings-status error global-settings-status">{error}</div>}

        <div className="settings-footer-actions">
          <Link href="/admin" className="ghost-btn"><ArrowLeft size={15} /> Back to Admin Panel</Link>
          <Link href="/" className="ghost-btn">Open public helper</Link>
        </div>
      </div>
    </div>
  )
}
