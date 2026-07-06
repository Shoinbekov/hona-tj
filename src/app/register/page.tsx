'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const BLUE   = '#1a56db';
const BORDER = '#d1d5db';

export default function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const router = useRouter();

  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('+992');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [busy, setBusy]         = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setBusy(true);
    const { error } = await signUp(email, password, name, phone);
    setBusy(false);

    if (error) {
      setError(
        error.includes('already registered') ? 'Пользователь с таким email уже существует' :
        error.includes('Password should') ? 'Пароль должен быть не менее 6 символов' :
        error
      );
    } else {
      setSuccess(true);
    }
  }

  const INPUT: React.CSSProperties = {
    width: '100%', height: 44, border: `1px solid ${BORDER}`, borderRadius: 8,
    fontSize: 15, color: '#111827', padding: '0 14px', outline: 'none',
    boxSizing: 'border-box', background: '#fff',
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: BLUE, height: 60, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px', textDecoration: 'none' }}>Хона.тж</Link>
        </header>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', maxWidth: 420, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 10, marginTop: 0 }}>
              Почти готово!
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.5, marginBottom: 24 }}>
              Мы отправили письмо на <b style={{ color: '#111827' }}>{email}</b>.<br/>
              Перейдите по ссылке в письме, чтобы подтвердить аккаунт.
            </p>
            <Link href="/login" style={{ display: 'inline-block', background: BLUE, color: '#fff', borderRadius: 8, padding: '12px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Перейти ко входу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: BLUE, height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px', textDecoration: 'none' }}>
          Хона.тж
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: 420, padding: '36px 32px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6, marginTop: 0 }}>
            Создать аккаунт
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, marginTop: 0 }}>
            Зарегистрируйтесь, чтобы подавать объявления.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Имя</label>
              <input
                type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                style={INPUT}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Телефон</label>
              <input
                type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+992 XX XXX XXXX"
                style={INPUT}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={INPUT}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Пароль</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                style={INPUT}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Подтверждение пароля</label>
              <input
                type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Повторите пароль"
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
              {busy ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 20, marginBottom: 0 }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" style={{ color: BLUE, fontWeight: 600, textDecoration: 'none' }}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
