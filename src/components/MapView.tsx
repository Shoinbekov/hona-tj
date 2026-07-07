'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { Map as LeafletMap, MarkerCluster } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PROPERTIES, formatPrice, getPriceInCurrency } from '@/lib/data';
import LocationPicker from '@/components/LocationPicker';

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

// Cluster bubble: blue circle with a white count, sized by how many listings it groups —
// small (<10), medium (<50), large (50+), matching the krisha.kz-style map clustering.
function createClusterIcon(cluster: MarkerCluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 36 : count < 50 ? 44 : 54;
  const fontSize = count < 10 ? 13 : count < 50 ? 14 : 16;

  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 50%;
      background: ${BLUE}; border: 3px solid rgba(26,86,219,0.3);
      color: #fff; font-weight: 700; font-size: ${fontSize}px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-family: system-ui, sans-serif;
    ">${count}</div>`,
    iconSize: L.point(size, size, true),
  });
}

// Dushanbe, city-level view — default map position
const DUSHANBE_CENTER: [number, number] = [38.5598, 68.7733];
const DUSHANBE_ZOOM = 12;
const MIN_ZOOM = 6;
const MAX_ZOOM = 18;

// Whole-country view, used when the "Весь Таджикистан" filter is chosen
const TJ_CENTER: [number, number] = [38.5598, 68.7733];
const TJ_ZOOM = 7;

// Dushanbe district centers — map zooms in to these when a district filter is selected
const DISTRICT_VIEWS: Record<string, [number, number, number]> = {
  'Сино':           [38.5598, 68.7733, 14],
  'Фирдавси':       [38.5731, 68.7864, 14],
  'Исмоили Сомони': [38.5900, 68.8100, 14],
  'Шохмансур':      [38.5450, 68.7600, 14],
};

// Flies the map to the matching view whenever the location filter actually changes.
// Compares against the previous value (rather than a "first render" flag) so that
// React 18 Strict Mode's double-invoked effects in dev can't misfire this as a real change.
function FlyToFilter({ city, district }: { city: string; district: string }) {
  const map = useMap();
  const prev = useRef({ city, district });

  useEffect(() => {
    if (prev.current.city === city && prev.current.district === district) return;
    prev.current = { city, district };

    if (district && DISTRICT_VIEWS[district]) {
      const [lat, lng, zoom] = DISTRICT_VIEWS[district];
      map.flyTo([lat, lng], zoom);
    } else if (!city || city === 'tj') {
      map.flyTo(TJ_CENTER, TJ_ZOOM);
    }
  }, [city, district, map]);

  return null;
}

// All properties that have coordinates
const WITH_COORDS = MOCK_PROPERTIES.filter(p => p.lat != null && p.lng != null);

const CTRL: React.CSSProperties = {
  height: 36, border: `1px solid ${BORDER}`, borderRadius: 6,
  fontSize: 13, color: '#111827', background: '#fff',
  padding: '0 10px', outline: 'none',
};

const SALE_TYPES = [
  { v: 'apartment',  l: 'квартиру' },
  { v: 'house',      l: 'дом или дачу' },
  { v: 'garage',     l: 'гараж или паркинг' },
  { v: 'land',       l: 'участок' },
  { v: 'commercial', l: 'коммерческую недвижимость' },
  { v: 'business',   l: 'бизнес' },
  { v: 'industrial', l: 'промбазы и склады' },
];

const RENT_TYPES = [
  { v: 'apartment',  l: 'квартиру' },
  { v: 'room',       l: 'комнату' },
  { v: 'house',      l: 'дом или дачу' },
  { v: 'garage',     l: 'гараж или паркинг' },
  { v: 'commercial', l: 'коммерческую недвижимость' },
  { v: 'industrial', l: 'промбазы и склады' },
];

interface Filters {
  listingType: 'sale' | 'rent';
  propertyType: string;
  city: string;
  district: string;
}

export default function MapView() {
  const { currency, rates } = useLanguage();
  const [filters, setFilters] = useState<Filters>({ listingType: 'sale', propertyType: 'apartment', city: 'tj', district: '' });
  const up = (patch: Partial<Filters>) => setFilters(f => ({ ...f, ...patch }));

  const mapRef = useRef<LeafletMap | null>(null);
  const didSetInitialView = useRef(false);

  // A fresh key per mount forces React to create a brand-new DOM node for MapContainer
  // every time MapView mounts, so Leaflet never sees a container that still carries a
  // stale `_leaflet_id` from a previous instance — that stale marker is what causes
  // "Map container is being reused by another instance".
  const [mapKey] = useState(() => `map-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Belt-and-suspenders: explicitly destroy the Leaflet map instance when MapView
  // unmounts, in case something (fast refresh, back/forward nav) skips react-leaflet's
  // own cleanup.
  useEffect(() => {
    return () => {
      try { mapRef.current?.remove(); } catch { /* already removed */ }
    };
  }, []);

  // Pin the map to the Dushanbe view once, after Leaflet has fully finished initializing —
  // guards against Leaflet computing its size/view before the container has its final layout.
  function handleMapReady() {
    if (didSetInitialView.current) return;
    didSetInitialView.current = true;
    mapRef.current?.setView(DUSHANBE_CENTER, DUSHANBE_ZOOM);
  }

  const subtypes = filters.listingType === 'rent' ? RENT_TYPES : SALE_TYPES;

  function onDealChange(val: 'sale' | 'rent') {
    const subs = val === 'rent' ? RENT_TYPES : SALE_TYPES;
    const keep = subs.some(s => s.v === filters.propertyType);
    up({ listingType: val, propertyType: keep ? filters.propertyType : subs[0].v });
  }

  const visible = useMemo(() => WITH_COORDS.filter(p => {
    if (p.listingType !== filters.listingType) return false;
    if (p.type !== filters.propertyType) return false;
    if (filters.city && filters.city !== 'tj' && p.city !== filters.city) return false;
    if (filters.district && p.district !== filters.district) return false;
    return true;
  }), [filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Filter strip ────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '8px 16px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

          <select value={filters.listingType}
            onChange={e => onDealChange(e.target.value as 'sale' | 'rent')}
            style={{ ...CTRL, minWidth: 128 }}>
            <option value="sale">Купить</option>
            <option value="rent">Арендовать</option>
          </select>

          <select value={filters.propertyType}
            onChange={e => up({ propertyType: e.target.value })}
            style={{ ...CTRL, minWidth: 200 }}>
            {subtypes.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>

          <LocationPicker
            city={filters.city}
            district={filters.district}
            onChange={(c, d) => up({ city: c, district: d })}
            buttonStyle={{ minWidth: 200, height: 36, fontSize: 13 }}
          />

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
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <MapContainer
          key={mapKey}
          ref={mapRef}
          center={DUSHANBE_CENTER}
          zoom={DUSHANBE_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          zoomControl
          whenReady={handleMapReady}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <FlyToFilter city={filters.city} district={filters.district} />

          <MarkerClusterGroup
            iconCreateFunction={createClusterIcon}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom
            zoomToBoundsOnClick
          >
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
                        {formatPrice(getPriceInCurrency(p, currency, rates), currency)}
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
          </MarkerClusterGroup>
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
