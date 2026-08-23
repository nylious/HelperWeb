'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AdminLoginForm(){
  const supabase=createClient();
  const router=useRouter();
  const params=useSearchParams();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        setError(error.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in right now.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="eyebrow">DAMANHOUR CITY</div>
        <h1>Admin Sign In</h1>
        <p className="muted">Private command management console.</p>

        <div className="field" style={{ marginTop: 22 }}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {params.get('error') === 'supabase-config' && (
          <div style={{ marginTop: 12, color: '#ff9090', fontSize: 12 }}>
            Supabase configuration is missing on the server.
          </div>
        )}

        {params.get('error') === 'not-admin' && (
          <div style={{ marginTop: 12, color: '#ff9090', fontSize: 12 }}>
            This account is not an administrator.
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, color: '#ff9090', fontSize: 12 }}>
            {error}
          </div>
        )}

        <button
          className="primary-btn"
          style={{ width: '100%', marginTop: 18 }}
          disabled={loading}
          type="submit"
        >
          {loading ? 'Signing in…' : 'SIGN IN'}
        </button>

        <Link
          href="/"
          className="ghost-btn"
          style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
        >
          Back to Helper
        </Link>
      </form>
    </div>
  );
}

export default function AdminLoginPage(){
  return (
    <Suspense
      fallback={
        <div className="login-shell">
          <div className="login-card">
            <div className="eyebrow">DAMANHOUR CITY</div>
            <h1>Admin Sign In</h1>
            <p className="muted">Loading secure sign-in…</p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
