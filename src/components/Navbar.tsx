'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';

const BLUE = '#1a56db';
const GREEN = '#16a34a';

export default function Navbar() {
  const { currency, setCurrency } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ background: BLUE, height: 60, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
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
            {(['USD', 'TJS', 'RUB'] as const).map((c, i, arr) => (
              <span key={c} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>|</span>}
                <button onClick={() => setCurrency(c)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: currency === c ? 700 : 400, opacity: currency === c ? 1 : 0.55, padding: '2px 5px' }}>
                  {c}
                </button>
              </span>
            ))}
          </div>

          <span style={{ color: '#fff', fontSize: 14, opacity: 0.8 }}>RU</span>

          <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 6, padding: '0 14px', height: 34, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Войти
          </button>

          <Link href="/add-listing"
            style={{ background: GREEN, color: '#fff', borderRadius: 6, padding: '0 16px', height: 34, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            + Подать объявление
          </Link>
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
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontSize: 14, marginRight: 8 }}>
              {(['USD', 'TJS', 'RUB'] as const).map((c, i) => (
                <span key={c} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <span style={{ opacity: 0.4 }}>|</span>}
                  <button onClick={() => setCurrency(c)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: currency === c ? 700 : 400, opacity: currency === c ? 1 : 0.6, padding: '0 3px' }}>{c}</button>
                </span>
              ))}
            </div>
            <Link href="/add-listing" onClick={() => setOpen(false)}
              style={{ flex: 1, background: GREEN, color: '#fff', borderRadius: 6, padding: '9px 0', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              + Объявление
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
