'use client';

import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PROPERTIES, DISTRICTS, formatPrice } from '@/lib/data';

const BLUE   = '#1a56db';
const GREEN  = '#16a34a';
const BORDER = '#d1d5db';

// Custom SVG pin icons — avoids Next.js/webpack issues with Leaflet's default image icons
const makePin = (color: string) => L.divIcon({
  className: '',
  html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 0C5.82 0 0 5.82 0 13c0 9.1 13 21 13 21S26 22.1 26 13C26 5.82 20.18 0 13 0z"
      fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="13" cy="13" r="5.5" fill="white"/>
  </svg>`,
  iconSize:    [26, 34],
  iconAnchor:  [13, 34],
  popupAnchor: [0, -36],
});

const ICONS = { sale: makePin(BLUE), rent: makePin(GREEN) };

// All properties that have coordinates
const WITH_COORDS = MOCK_PROPERTIES.filter(p => p.lat != null && p.lng != null);

const CTRL: React.CSSProperties = {
  height: 36, border: `1px solid ${BORDER}`, borderRadius: 6,
  fontSize: 13, color: '#111827', background: '#fff',
  padding: '0 10px', outline: 'none',
};

const MAP_TYPES = [
  { v: 'all',        l: 'Тип жилья' },
  { v: 'apartment',  l: 'Квартира' },
  { v: 'house',      l: 'Дом' },
  { v: 'commercial', l: 'Коммерческая' },
  { v: 'land',       l: 'Участок' },
  { v: 'garage',     l: 'Гараж' },
];

interface Filters {
  listingType: 'all' | 'sale' | 'rent';
  propertyType: string;
  district: string;
}

export default function MapView() {
  const { currency } = useLanguage();
  const [filters, setFilters] = useState<Filters>({ listingType: 'all', propertyType: 'all', district: '' });
  const up = (patch: Partial<Filters>) => setFilters(f => ({ ...f, ...patch }));

  const visible = useMemo(() => WITH_COORDS.filter(p => {
    if (filters.listingType !== 'all' && p.listingType !== filters.listingType) return false;
    if (filters.propertyType !== 'all' && p.type !== filters.propertyType) return false;
    if (filters.district && p.district !== filters.district) return false;
    return true;
  }), [filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Filter strip ────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '8px 16px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

          <select value={filters.listingType}
            onChange={e => up({ listingType: e.target.value as Filters['listingType'] })}
            style={{ ...CTRL, minWidth: 148 }}>
            <option value="all">Купить и арендовать</option>
            <option value="sale">Купить</option>
            <option value="rent">Арендовать</option>
          </select>

          <select value={filters.propertyType}
            onChange={e => up({ propertyType: e.target.value })}
            style={{ ...CTRL, minWidth: 155 }}>
            {MAP_TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>

          <select value={filters.district}
            onChange={e => up({ district: e.target.value })}
            style={{ ...CTRL, minWidth: 148 }}>
            <option value="">Все районы</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <span style={{ fontSize: 13, color: '#6b7280' }}>
            Показано <b style={{ color: '#111827' }}>{visible.length}</b> объявлений
          </span>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginLeft: 'auto', alignItems: 'center' }}>
            {([['#1a56db', 'Продажа'], ['#16a34a', 'Аренда']] as const).map(([c, l]) => (
              <span key={l} style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <MapContainer
          center={[38.5598, 68.7733]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {visible.map(p => (
            <Marker
              key={p.id}
              position={[p.lat!, p.lng!]}
              icon={ICONS[p.listingType]}
            >
              <Popup maxWidth={230} minWidth={230}>
                <div style={{ width: 230, fontFamily: 'system-ui, sans-serif' }}>
                  {p.images[0] && (
                    <img
                      src={p.images[0]}
                      alt={p.title.ru}
                      style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  <div style={{ padding: '10px 12px 12px' }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: BLUE }}>
                      {formatPrice(currency === 'USD' ? p.priceUSD : p.priceTJS, currency)}
                    </div>
                    <div style={{ fontSize: 13, color: '#111827', marginTop: 4, lineHeight: 1.35 }}>
                      {p.title.ru}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
                      {p.district} · {p.area} м²
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                      <a href={`/property/${p.id}`}
                        style={{ flex: 1, background: BLUE, color: '#fff', borderRadius: 5, padding: '7px 0', fontSize: 12, fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                        Подробнее
                      </a>
                      <a href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, background: '#25d366', color: '#fff', borderRadius: 5, padding: '7px 0', fontSize: 12, fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Popup CSS overrides */}
      <style>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: inherit !important;
        }
        .leaflet-popup-tip {
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
