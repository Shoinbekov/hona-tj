'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const BLUE  = '#1a56db';
const BORDER = '#d1d5db';

export default function LoginPage() {
  const { signIn, signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      setError(
        error.includes('Invalid login') ? 'Неверный email или пароль' :
        error.includes('Email not confirmed') ? 'Подтвердите email перед входом' :
        error
      );
    } else {
      router.push('/dashboard');
    }
  }

  async function handleGoogle() {
    setError('');
    await signInWithGoogle();
  }

  const INPUT: React.CSSProperties = {
    width: '100%', height: 44, border: `1px solid ${BORDER}`, borderRadius: 8,
    fontSize: 15, color: '#111827', padding: '0 14px', outline: 'none',
    boxSizing: 'border-box', background: '#fff',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: BLUE, height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px', textDecoration: 'none' }}>
          Хона.тж
        </Link>
      </header>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: 420, padding: '36px 32px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6, marginTop: 0 }}>
            Войти в аккаунт
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, marginTop: 0 }}>
            С возвращением! Введите ваши данные.
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{ width: '100%', height: 44, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 15, fontWeight: 500, color: '#374151', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Войти через Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 13, color: '#9ca3af' }}>или</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={INPUT}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Пароль
              </label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={INPUT}
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={busy}
              style={{ width: '100%', height: 44, background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}>
              {busy ? 'Входим...' : 'Войти'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 20, marginBottom: 0 }}>
            Нет аккаунта?{' '}
            <Link href="/register" style={{ color: BLUE, fontWeight: 600, textDecoration: 'none' }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
