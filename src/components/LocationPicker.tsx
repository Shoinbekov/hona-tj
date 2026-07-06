'use client';

import { useState, useEffect } from 'react';

const BLUE   = '#1a56db';
const BORDER = '#d1d5db';

// ─── Location data ─────────────────────────────────────────────────────────

export const CITY_DATA = [
  {
    value: 'tj',
    label: 'Весь Таджикистан',
    districts: [] as { value: string; label: string }[],
  },
  {
    value: 'dushanbe',
    label: 'Душанбе',
    districts: [
      { value: 'Сино',           label: 'Сино' },
      { value: 'Фирдавси',       label: 'Фирдавси' },
      { value: 'Исмоили Сомони', label: 'Исмоили Сомони' },
      { value: 'Шохмансур',      label: 'Шохмансур' },
      { value: 'Хомадони',       label: 'Хомадони' },
    ],
  },
  {
    value: 'khujand',
    label: 'Худжанд',
    districts: [
      { value: 'Худжанд-Центр',    label: 'Центр' },
      { value: 'Спитамен',         label: 'Спитамен' },
      { value: 'Бободжон Гафуров', label: 'Бободжон Гафуров' },
    ],
  },
  {
    value: 'kulob',
    label: 'Куляб',
    districts: [
      { value: 'Куляб-Центр', label: 'Центр' },
      { value: 'Восе',        label: 'Восе' },
      { value: 'Муминобод',   label: 'Муминобод' },
    ],
  },
  {
    value: 'khorog',
    label: 'Хорог',
    districts: [
      { value: 'Хорог-Центр', label: 'Центр' },
      { value: 'Рошткала',    label: 'Рошткала' },
    ],
  },
  {
    value: 'bokhtar',
    label: 'Бохтар',
    districts: [
      { value: 'Бохтар-Центр', label: 'Центр' },
      { value: 'Вахш',         label: 'Вахш' },
      { value: 'Джиликул',     label: 'Джиликул' },
    ],
  },
  {
    value: 'isfara',
    label: 'Исфара',
    districts: [{ value: 'Исфара-Центр', label: 'Центр' }],
  },
  {
    value: 'kanibadam',
    label: 'Канибадам',
    districts: [{ value: 'Канибадам-Центр', label: 'Центр' }],
  },
  {
    value: 'tursunzoda',
    label: 'Турсунзода',
    districts: [{ value: 'Турсунзода-Центр', label: 'Центр' }],
  },
];

export function getLocationLabel(city: string, district: string): string {
  if (!city || city === 'tj') return 'Весь Таджикистан';
  const c = CITY_DATA.find(x => x.value === city);
  if (!c) return 'Весь Таджикистан';
  if (!district) return c.label;
  const d = c.districts.find(x => x.value === district);
  return d ? `${c.label}, ${d.label}` : c.label;
}

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  city: string;
  district: string;
  onChange: (city: string, district: string) => void;
  buttonStyle?: React.CSSProperties;
}

export default function LocationPicker({ city, district, onChange, buttonStyle }: Props) {
  const [open, setOpen]               = useState(false);
  const [search, setSearch]           = useState('');
  const [activeCity, setActiveCity]   = useState(city || 'tj');
  const [pendingCity, setPendingCity] = useState(city || 'tj');
  const [pendingDist, setPendingDist] = useState(district);

  // Sync pending state when modal opens
  function handleOpen() {
    setActiveCity(city || 'tj');
    setPendingCity(city || 'tj');
    setPendingDist(district);
    setSearch('');
    setOpen(true);
  }

  function handleClose() { setOpen(false); }

  function handleConfirm() {
    onChange(pendingCity, pendingDist);
    setOpen(false);
  }

  function selectCity(v: string) {
    setActiveCity(v);
    setPendingCity(v);
    setPendingDist('');
  }

  function selectDistrict(v: string) {
    setPendingDist(v);
    setPendingCity(activeCity);
  }

  // Close on Escape; lock body scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Filter by search query
  const q = search.toLowerCase().trim();
  const visibleCities = CITY_DATA.filter(c =>
    !q || c.label.toLowerCase().includes(q) ||
    c.districts.some(d => d.label.toLowerCase().includes(q))
  );
  const activeCityData = CITY_DATA.find(c => c.value === activeCity);
  const visibleDistricts = (activeCityData?.districts ?? []).filter(
    d => !q || d.label.toLowerCase().includes(q)
  );

  const label     = getLocationLabel(city, district);
  const hasChoice = city && city !== 'tj';

  return (
    <>
      {/* ── Trigger ────────────────────────────────── */}
      <button
        onClick={handleOpen}
        style={{
          height: 40, border: `1px solid ${BORDER}`, borderRadius: 6,
          fontSize: 14, color: hasChoice ? '#111827' : '#6b7280',
          background: '#fff', padding: '0 10px 0 12px', outline: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap', textAlign: 'left',
          ...buttonStyle,
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
        {/* chevron */}
        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" style={{ flexShrink: 0 }}>
          <path d="M1 1l4.5 4.5L10 1" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Modal ──────────────────────────────────── */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 12, width: '100%', maxWidth: 680,
              margin: '0 16px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column', maxHeight: '82vh',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Местоположение</span>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#6b7280', lineHeight: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.5 1.5l13 13M14.5 1.5l-13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Поиск по городу, району, микрорайону"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%', height: 38, border: `1px solid ${BORDER}`, borderRadius: 8,
                    fontSize: 14, color: '#111827', paddingLeft: 34, paddingRight: 12,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Body: two columns */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 280 }}>

              {/* Left: cities */}
              <div style={{ width: 220, borderRight: '1px solid #e5e7eb', overflowY: 'auto', flexShrink: 0 }}>
                {visibleCities.map(c => {
                  const active = activeCity === c.value;
                  return (
                    <button
                      key={c.value}
                      onClick={() => selectCity(c.value)}
                      style={{
                        width: '100%', padding: '10px 16px 10px 14px',
                        textAlign: 'left', border: 'none', borderLeft: active ? `3px solid ${BLUE}` : '3px solid transparent',
                        background: active ? '#eff6ff' : 'transparent',
                        color: active ? BLUE : '#374151',
                        fontWeight: active ? 600 : 400,
                        fontSize: 14, cursor: 'pointer', display: 'block',
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Right: districts */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {activeCity === 'tj' ? (
                  <p style={{ padding: '16px', fontSize: 13, color: '#9ca3af', margin: 0 }}>
                    Поиск по всему Таджикистану
                  </p>
                ) : (
                  <>
                    {/* "All districts" row */}
                    {(() => {
                      const sel = pendingCity === activeCity && pendingDist === '';
                      return (
                        <button
                          onClick={() => selectDistrict('')}
                          style={{
                            width: '100%', padding: '10px 16px', textAlign: 'left', border: 'none',
                            background: sel ? '#eff6ff' : 'transparent',
                            color: sel ? BLUE : '#374151',
                            fontWeight: sel ? 600 : 400,
                            fontSize: 14, cursor: 'pointer', display: 'block',
                          }}
                        >
                          Все районы
                        </button>
                      );
                    })()}
                    {visibleDistricts.map(d => {
                      const sel = pendingCity === activeCity && pendingDist === d.value;
                      return (
                        <button
                          key={d.value}
                          onClick={() => selectDistrict(d.value)}
                          style={{
                            width: '100%', padding: '10px 16px', textAlign: 'left', border: 'none',
                            background: sel ? '#eff6ff' : 'transparent',
                            color: sel ? BLUE : '#374151',
                            fontWeight: sel ? 600 : 400,
                            fontSize: 14, cursor: 'pointer', display: 'block',
                          }}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button
                onClick={handleConfirm}
                style={{
                  background: BLUE, color: '#fff', border: 'none', borderRadius: 6,
                  height: 40, padding: '0 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Выбрать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
