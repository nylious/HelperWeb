'use client'

import {
  Suspense,
  useEffect,
  useState
} from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import {
  useRouter,
  useSearchParams
} from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AdminLoginForm() {
  const router =
    useRouter()

  const params =
    useSearchParams()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [rememberMe, setRememberMe] =
    useState(true)

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  useEffect(() => {
    const remembered = window.localStorage.getItem('dch_admin_email')
    if (remembered) setEmail(remembered)
  }, [])

  async function submit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (loading)
      return

    setError('')
    setLoading(true)

    try {
      const supabase =
        createClient()

      const signIn =
        supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

      const timeout =
        new Promise<never>(
          (_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    'Sign in timed out. Check the Supabase URL/key and try again.'
                  )
                ),
              12000
            )
        )

      const { error: authError } =
        await Promise.race([
          signIn,
          timeout
        ])

      if (authError) {
        setError(
          authError.message
        )
        return
      }

      if (rememberMe) {
        window.localStorage.setItem('dch_admin_email', email.trim())
        document.cookie = 'dch_remember=1; Path=/; Max-Age=2592000; SameSite=Lax'
      } else {
        window.localStorage.removeItem('dch_admin_email')
        document.cookie = 'dch_remember=0; Path=/; SameSite=Lax'
      }

      router.replace('/admin')
      router.refresh()
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : 'Unable to sign in right now.'
      )
    } finally {
      setLoading(false)
    }
  }

  const queryError =
    params.get('error')

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-a" />
      <div className="auth-glow auth-glow-b" />

      <section className="auth-frame">
        <div className="auth-brand">
          <div className="auth-brand-mark">
            <Sparkles size={18} />
          </div>

          <div>
            <div className="auth-brand-name">
              DAMANHOUR CITY
            </div>

            <div className="auth-brand-subtitle">
              Commands / Codes Control
            </div>
          </div>
        </div>

        <div className="auth-grid">
          <div className="auth-pitch">
            <div className="auth-overline">
              PRIVATE ADMIN CONSOLE
            </div>

            <h1>
              Manage the helper
              <br />
              <span>from one place.</span>
            </h1>

            <p>
              Update commands, categories and
              item data without rebuilding the
              public helper.
            </p>

            <div className="auth-trust-row">
              <div className="auth-trust-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>
                  Protected workspace
                </strong>

                <span>
                  Supabase authenticated access
                </span>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-card-head">
              <div>
                <div className="auth-card-kicker">
                  WELCOME BACK
                </div>

                <h2>
                  Admin sign in
                </h2>

                <p>
                  Use your administrator account
                  to continue.
                </p>
              </div>
            </div>

            {queryError === 'not-admin' && (
              <div className="auth-alert auth-alert-error">
                This account is not an administrator.
              </div>
            )}

            {queryError === 'inactive' && (
              <div className="auth-alert auth-alert-info">
                You were signed out after 15 minutes of inactivity.
              </div>
            )}

            {queryError === 'supabase-config' && (
              <div className="auth-alert auth-alert-error">
                Supabase configuration is missing
                on the deployment.
              </div>
            )}

            {error && (
              <div className="auth-alert auth-alert-error">
                {error}
              </div>
            )}

            <form
              onSubmit={submit}
              className="auth-form"
            >
              <label className="auth-field">
                <span>Email</span>

                <div className="auth-input-wrap">
                  <Mail size={17} />

                  <input
                    type="email"
                    value={email}
                    onChange={event =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Password</span>

                <div className="auth-input-wrap">
                  <LockKeyhole size={17} />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={event =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    required
                  />

                  <button
                    type="button"
                    className="auth-icon-button"
                    onClick={() =>
                      setShowPassword(
                        value => !value
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              <div className="remember-row">
                <label className="remember-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <span>15 min inactivity timeout</span>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? 'Signing in...'
                    : 'Sign in'}
                </span>

                <ArrowRight size={17} />
              </button>
            </form>

            <Link
              href="/"
              className="auth-back"
            >
              ← Back to Helper
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <div className="auth-loading-card">
            Loading secure sign-in...
          </div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
