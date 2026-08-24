'use client'

import {
  ArrowRight,
  KeyRound,
  LogOut,
  Save,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminAccountMenu({
  displayName,
  isAdmin,
}: {
  displayName: string
  isAdmin: boolean
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'menu' | 'account'>('menu')
  const [name, setName] = useState(displayName)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setName(displayName)
  }, [displayName])

  if (!isAdmin) {
    return (
      <Link href="/admin/login" className="admin-link">
        <ShieldCheck size={16} />
        <span>Admin</span>
      </Link>
    )
  }

  async function saveProfile() {
    if (saving) return

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

      const result = (await response.json()) as {
        ok?: boolean
        error?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || 'Could not save account changes.',
        )
      }

      setStatus('Account updated successfully.')
      setNewPassword('')
      setConfirmPassword('')

      window.setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : 'Could not save account changes.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function signOut() {
    try {
      await fetch('/auth/signout', {
        method: 'POST',
      })
    } finally {
      window.location.href = '/admin/login'
    }
  }

  return (
    <>
      <button
        className="admin-link account-trigger"
        onClick={() => {
          setOpen(true)
          setStatus('')
          setError('')
          setView('menu')
        }}
        aria-expanded={open}
        aria-controls="admin-account-drawer"
      >
        <ShieldCheck size={16} />
        <span>Admin</span>
        {name.trim() && <b>{name.trim()}</b>}
      </button>

      {open && (
        <>
          <button
            className="drawer-backdrop"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
          />

          <aside
            id="admin-account-drawer"
            className="account-drawer account-drawer-compact"
            aria-label="Admin account menu"
          >
            <div className="account-drawer-head compact">
              <div>
                <div className="dashboard-kicker">ACCOUNT</div>
                <h2>{name.trim() || 'Admin'}</h2>
                <p>Quick account controls.</p>
              </div>

              <button
                className="drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="account-profile-chip compact">
              <div className="account-avatar">
                <UserRound size={18} />
              </div>
              <div>
                <strong>{name.trim() || 'Administrator'}</strong>
                <span>Administrator account</span>
              </div>
            </div>

            {view === 'menu' ? (
              <>
            <div className="account-menu-actions">
              <Link
                href="/admin"
                className="account-menu-item primary"
                onClick={() => setOpen(false)}
              >
                <div className="account-menu-icon">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <strong>Admin Panel</strong>
                  <span>Open the command manager</span>
                </div>
                <ArrowRight size={15} />
              </Link>

              <button
                className="account-menu-item"
                onClick={() => {
                  setStatus('')
                  setError('')
                  setView('account')
                }}
              >
                <div className="account-menu-icon">
                  <Settings size={16} />
                </div>
                <div>
                  <strong>Account</strong>
                  <span>Edit your name or password</span>
                </div>
                <ArrowRight size={15} />
              </button>

              <button
                className="account-menu-item danger"
                onClick={signOut}
              >
                <div className="account-menu-icon">
                  <LogOut size={16} />
                </div>
                <div>
                  <strong>Sign out</strong>
                  <span>End your admin session</span>
                </div>
                <ArrowRight size={15} />
              </button>
            </div>


              </>
            ) : (
              <>
            <div
              id="admin-account-editor"
              className="account-editor-panel"
            >
              <div className="account-section-title">
                <Settings size={15} />
                ACCOUNT DETAILS
              </div>

              <label className="account-field">
                <span>DISPLAY NAME</span>
                <div className="account-input-wrap">
                  <UserRound size={16} />
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your admin name"
                  />
                </div>
              </label>

              <label className="account-field">
                <span>NEW PASSWORD</span>
                <div className="account-input-wrap">
                  <KeyRound size={16} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="Leave blank to keep it"
                  />
                </div>
              </label>

              <label className="account-field">
                <span>CONFIRM PASSWORD</span>
                <div className="account-input-wrap">
                  <KeyRound size={16} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm new password"
                  />
                </div>
              </label>

              <button
                className="primary-btn account-save-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                <Save size={15} />
                {saving ? 'Saving…' : 'Save account'}
              </button>

              {status && (
                <div className="settings-status success">
                  {status}
                </div>
              )}

              {error && (
                <div className="settings-status error">
                  {error}
                </div>
              )}
            </div>


                <button
                  className="account-back-button"
                  onClick={() => {
                    setStatus('')
                    setError('')
                    setView('menu')
                  }}
                >
                  ← Back to account menu
                </button>
              </>
            )}

            <div className="account-drawer-note">
              Authentication is managed securely by Supabase.
            </div>
          </aside>
        </>
      )}
    </>
  )
}
