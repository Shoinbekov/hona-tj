'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';

const BLUE  = '#1a56db';
const GREEN = '#16a34a';

export default function Navbar() {
  const { currency, setCurrency } = useLanguage();
  const { user, signOut }         = useAuth();
  const router                    = useRouter();
  const [open, setOpen]           = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef                   = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropOpen) return;
    function onOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [dropOpen]);

  async function handleSignOut() {
    setDropOpen(false);
    await signOut();
    router.push('/');
  }

  function goToAddListing() {
    router.push(user ? '/add-listing' : '/login');
  }

  const displayName = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'Профиль';
  const initial = displayName[0]?.toUpperCase() ?? 'П';

  // zIndex must clear Leaflet's own panes/controls (up to 1000) so the dropdown below
  // isn't trapped under the map's stacking context — a child's z-index can never
  // outrank content that already beats its positioned ancestor.
  return (
    <header style={{ background: BLUE, height: 60, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center' }}>

        {/* Logo */}
        <Link href="/"
          style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px', flexShrink: 0, textDecoration: 'none' }}>
          Хона.тж
        </Link>

        {/* Center links */}
        <nav style={{ display: 'flex', marginLeft: 8, flex: 1 }} className="hidden md:flex">
          {[
            { href: '/?lt=rent', label: 'Аренда' },
            { href: '/?lt=sale', label: 'Продажа' },
            { href: '/?pt=commercial', label: 'Коммерческая' },
          ].map(({ href, label }) => (
            <Link key={label} href={href}
              style={{ color: '#fff', fontSize: 14, fontWeight: 500, padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', textDecoration: 'none', opacity: 0.9 }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }} className="hidden md:flex">

          {/* USD / TJS / RUB */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, color: '#fff', fontSize: 14 }}>
            {(['USD', 'TJS', 'RUB'] as const).map((c, i) => (
              <span key={c} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>|</span>}
                <button onClick={() => setCurrency(c)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: currency === c ? 700 : 400, opacity: currency === c ? 1 : 0.55, padding: '2px 5px' }}>
                  {c}
                </button>
              </span>
            ))}
          </div>

          <span style={{ color: '#fff', fontSize: 14, opacity: 0.8 }}>RU</span>

          {/* Auth block */}
          {user ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(o => !o)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, height: 34, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff' }}>
                {/* Avatar */}
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', color: BLUE, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {initial}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
                <ChevronDown size={14} style={{ flexShrink: 0, opacity: 0.7, transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>

              {dropOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: 180, overflow: 'hidden', zIndex: 9999 }}>
                  <Link href="/dashboard" onClick={() => setDropOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: '#111827', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <LayoutDashboard size={15} color="#6b7280" />
                    Мои объявления
                  </Link>
                  <div style={{ height: 1, background: '#e5e7eb' }} />
                  <button onClick={handleSignOut}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: '#dc2626', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <LogOut size={15} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 6, padding: '0 14px', height: 34, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              Войти
            </Link>
          )}

          <button onClick={goToAddListing}
            style={{ background: GREEN, color: '#fff', border: 'none', borderRadius: 6, padding: '0 16px', height: 34, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            + Подать объявление
          </button>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          aria-label="Меню">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ background: '#1340c0', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px 16px' }}>
          {[{ href: '/?lt=rent', label: 'Аренда' }, { href: '/?lt=sale', label: 'Продажа' }, { href: '/?pt=commercial', label: 'Коммерческая' }].map(({ href, label }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}
              style={{ display: 'block', color: '#fff', fontSize: 15, padding: '11px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                style={{ display: 'block', color: '#fff', fontSize: 15, padding: '11px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Мои объявления
              </Link>
              <button onClick={() => { setOpen(false); handleSignOut(); }}
                style={{ display: 'block', color: '#fca5a5', fontSize: 15, padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Выйти
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}
              style={{ display: 'block', color: '#fff', fontSize: 15, padding: '11px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Войти
            </Link>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontSize: 14, marginRight: 8 }}>
              {(['USD', 'TJS', 'RUB'] as const).map((c, i) => (
                <span key={c} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <span style={{ opacity: 0.4 }}>|</span>}
                  <button onClick={() => setCurrency(c)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: currency === c ? 700 : 400, opacity: currency === c ? 1 : 0.6, padding: '0 3px' }}>{c}</button>
                </span>
              ))}
            </div>
            <button onClick={() => { setOpen(false); goToAddListing(); }}
              style={{ flex: 1, background: GREEN, color: '#fff', border: 'none', borderRadius: 6, padding: '9px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              + Объявление
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
