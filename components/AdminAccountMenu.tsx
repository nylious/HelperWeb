'use client'

import { LogOut, Mail, Save, ShieldCheck, UserRound, X, KeyRound } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminAccountMenu({
  email,
  displayName,
  isAdmin,
}: {
  email: string
  displayName: string
  isAdmin: boolean
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(displayName)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setName(displayName)
  }, [displayName])

  async function saveProfile() {
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: name.trim(),
          password: newPassword,
          password_confirm: confirmPassword,
        }),
      })
      const result = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Could not save profile.')
      setStatus('Profile updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
      window.setTimeout(() => window.location.reload(), 350)
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  async function signOut() {
    await fetch('/auth/signout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const label = isAdmin ? (name.trim() || 'Admin') : 'Admin'

  if (!isAdmin) {
    return <a href="/admin/login" className="admin-link"><ShieldCheck size={16} /> Admin</a>
  }

  return (
    <>
      <button className="admin-link account-trigger" onClick={() => setOpen(true)}>
        <ShieldCheck size={16} />
        <span>Admin</span>
        {name.trim() && <b>{name.trim()}</b>}
      </button>

      {open && (
        <>
          <button className="drawer-backdrop" aria-label="Close account" onClick={() => setOpen(false)} />
          <aside className="account-drawer" aria-label="Admin account">
            <div className="account-drawer-head">
              <div>
                <div className="dashboard-kicker">ADMIN ACCOUNT</div>
                <h2>{label}</h2>
                <p>Manage your profile and session.</p>
              </div>
              <button className="drawer-close" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>

            <div className="account-profile-chip">
              <div className="account-avatar"><UserRound size={18} /></div>
              <div>
                <strong>{name.trim() || 'Administrator'}</strong>
                <span>{email}</span>
              </div>
            </div>

            <label className="account-field">
              <span>DISPLAY NAME</span>
              <div className="account-input-wrap">
                <UserRound size={16} />
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your admin name" />
              </div>
            </label>

            <label className="account-field">
              <span>EMAIL</span>
              <div className="account-input-wrap readonly">
                <Mail size={16} />
                <input value={email} readOnly />
              </div>
            </label>

            <div className="account-divider" />

            <div className="account-kicker-row">
              <div>
                <div className="dashboard-kicker">PASSWORD</div>
                <p>Leave these blank to keep your current password.</p>
              </div>
              <KeyRound size={17} />
            </div>

            <label className="account-field">
              <span>NEW PASSWORD</span>
              <div className="account-input-wrap">
                <KeyRound size={16} />
                <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="••••••••" />
              </div>
            </label>

            <label className="account-field">
              <span>CONFIRM PASSWORD</span>
              <div className="account-input-wrap">
                <KeyRound size={16} />
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="••••••••" />
              </div>
            </label>

            <div className="account-actions">
              <button className="primary-btn" onClick={saveProfile} disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving…' : 'Save profile'}
              </button>
              <button className="account-signout" onClick={signOut}>
                <LogOut size={15} />
                Sign out
              </button>
            </div>

            {status && <div className="settings-status success">{status}</div>}
            {error && <div className="settings-status error">{error}</div>}
          </aside>
        </>
      )}
    </>
  )
}
