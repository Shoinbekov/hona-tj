'use client';

import Link from 'next/link';
import { SearchFilters } from '@/types';
import { DISTRICTS } from '@/lib/data';

const BLUE   = '#1a56db';
const BORDER = '#d1d5db';
const CTRL: React.CSSProperties = {
  height: 40, border: `1px solid ${BORDER}`, borderRadius: 6,
  fontSize: 14, color: '#111827', background: '#fff',
  padding: '0 10px', outline: 'none', width: '100%',
};
const SMALL: React.CSSProperties = { ...CTRL, width: 72, minWidth: 0, padding: '0 8px' };

// ─── Reference data ────────────────────────────────────────────────────────

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

const ROOM_OPTS: [string, string][] = [
  ['',    'любой комнатности'],
  ['1',   '1 - комн.'],
  ['1-2', '1-2 - комн.'],
  ['2',   '2 - комн.'],
  ['2-3', '2-3 - комн.'],
  ['3',   '3 - комн.'],
  ['3-4', '3-4 - комн.'],
  ['4',   '4 - комн.'],
  ['4-5', '4-5 - комн.'],
  ['5+',  '5 и более комн.'],
];

// ─── Logic helpers ─────────────────────────────────────────────────────────

function needsRooms(sub: string)  { return sub === 'apartment' || sub === 'house'; }
function needsPeriod(lt: string, sub: string) { return lt === 'rent' && (sub === 'apartment' || sub === 'house'); }
function needsAreaSqm(sub: string)  { return sub === 'commercial'; }
function needsAreaSotok(sub: string) { return sub === 'land'; }

function priceUnit(lt: string, sub: string, period: string): string {
  if (lt === 'rent' && period === 'daily') return 'сом/сут.';
  if (sub === 'room' || sub === 'industrial') return 'сом/мес.';
  return 'сом.';
}

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  resultCount: number;
}

export default function SmartFilter({ filters: f, onChange, resultCount }: Props) {
  const up = (patch: Partial<SearchFilters>) => onChange({ ...f, ...patch });

  const lt  = f.listingType;
  const sub = f.propertyType === 'all' ? '' : (f.propertyType as string);

  const subtypes   = lt === 'rent' ? RENT_TYPES : SALE_TYPES;
  const showPeriod = needsPeriod(lt, sub);
  const showRooms  = needsRooms(sub);
  const showSqm    = needsAreaSqm(sub);
  const showSotok  = needsAreaSotok(sub);
  const unit       = priceUnit(lt, sub, f.rentPeriod);

  function onDealChange(val: string) {
    const subs = val === 'rent' ? RENT_TYPES : SALE_TYPES;
    const keep = sub && subs.some(s => s.v === sub);
    up({
      listingType:  val as SearchFilters['listingType'],
      propertyType: (keep ? sub : subs[0].v) as SearchFilters['propertyType'],
      rooms: '', rentPeriod: 'monthly',
      areaFrom: '', areaTo: '', landAreaFrom: '', landAreaTo: '',
    });
  }

  function onSubChange(val: string) {
    up({
      propertyType: val as SearchFilters['propertyType'],
      rooms: '', rentPeriod: 'monthly',
      areaFrom: '', areaTo: '', landAreaFrom: '', landAreaTo: '',
    });
  }

  const hasReset =
    lt !== 'sale' || sub !== 'apartment' || !!f.district || !!f.rooms ||
    !!f.minPrice || !!f.maxPrice || !!f.areaFrom || !!f.areaTo ||
    !!f.landAreaFrom || !!f.landAreaTo || f.hasPhoto || f.fromOwner || f.newBuilding;

  // Row-2 checkboxes: buy → фото + новостройка + хозяев; rent → фото + хозяев
  const chkItems: [keyof SearchFilters, string][] = [
    ['hasPhoto',   'есть фото'],
    ...(lt !== 'rent' ? [['newBuilding', 'новостройка'] as [keyof SearchFilters, string]] : []),
    ['fromOwner',  'от хозяев'],
  ];

  return (
    <>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 0', position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>

          {/* ── Строка 1 ──────────────────────────────── */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Тип сделки */}
            <select value={lt} onChange={e => onDealChange(e.target.value)}
              style={{ ...CTRL, minWidth: 128, flex: '0 0 128px' }}>
              <option value="sale">Купить</option>
              <option value="rent">Арендовать</option>
            </select>

            {/* Тип объекта */}
            <select value={sub} onChange={e => onSubChange(e.target.value)}
              style={{ ...CTRL, minWidth: 200, flex: '0 0 200px' }}>
              {subtypes.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>

            {/* Район */}
            <select value={f.district} onChange={e => up({ district: e.target.value })}
              style={{ ...CTRL, minWidth: 148, flex: '0 0 148px' }}>
              <option value="">Все районы</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Период — только аренда квартиры/дома */}
            {showPeriod && (
              <select value={f.rentPeriod}
                onChange={e => up({ rentPeriod: e.target.value as 'monthly' | 'daily' })}
                style={{ ...CTRL, minWidth: 120, flex: '0 0 120px' }}>
                <option value="monthly">Помесячно</option>
                <option value="daily">Посуточно</option>
              </select>
            )}

            {/* Комнатность — квартира/дом */}
            {showRooms && (
              <select value={f.rooms} onChange={e => up({ rooms: e.target.value })}
                style={{ ...CTRL, minWidth: 175, flex: '0 0 175px' }}>
                {ROOM_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            )}

            {/* Площадь м² — коммерческая */}
            {showSqm && (
              <>
                <input type="number" placeholder="От" value={f.areaFrom}
                  onChange={e => up({ areaFrom: e.target.value })} style={SMALL} />
                <input type="number" placeholder="До" value={f.areaTo}
                  onChange={e => up({ areaTo: e.target.value })} style={SMALL} />
                <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }}>м²</span>
              </>
            )}

            {/* Площадь соток — участок */}
            {showSotok && (
              <>
                <input type="number" placeholder="От" value={f.landAreaFrom}
                  onChange={e => up({ landAreaFrom: e.target.value })} style={SMALL} />
                <input type="number" placeholder="До" value={f.landAreaTo}
                  onChange={e => up({ landAreaTo: e.target.value })} style={SMALL} />
                <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }}>соток</span>
              </>
            )}

            {/* Цена */}
            <input type="number" placeholder="От" value={f.minPrice}
              onChange={e => up({ minPrice: e.target.value })}
              style={{ ...CTRL, minWidth: 88, flex: '1 1 88px' }} />
            <span style={{ fontSize: 14, color: '#9ca3af', flexShrink: 0 }}>—</span>
            <input type="number" placeholder="До" value={f.maxPrice}
              onChange={e => up({ maxPrice: e.target.value })}
              style={{ ...CTRL, minWidth: 88, flex: '1 1 88px' }} />
            <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{unit}</span>

            {/* Найти */}
            <button style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, height: 40, padding: '0 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              Найти
            </button>

            {/* На карте */}
            <Link href="/map" style={{ background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 6, height: 40, padding: '0 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              На карте
            </Link>

            {/* Сбросить */}
            {hasReset && (
              <button
                onClick={() => up({
                  listingType: 'sale', propertyType: 'apartment', district: '', rooms: '',
                  minPrice: '', maxPrice: '', rentPeriod: 'monthly',
                  areaFrom: '', areaTo: '', landAreaFrom: '', landAreaTo: '',
                  hasPhoto: false, fromOwner: false, newBuilding: false,
                })}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer', padding: '0 4px', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                Сбросить
              </button>
            )}
          </div>

          {/* ── Строка 2: чекбоксы ───────────────────── */}
          <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
            {chkItems.map(([k, l]) => (
              <label key={String(k)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={!!f[k]}
                  onChange={e => up({ [k]: e.target.checked } as Partial<SearchFilters>)}
                  style={{ width: 15, height: 15, cursor: 'pointer' }}
                />
                {l}
              </label>
            ))}
          </div>

        </div>
      </div>

      {/* Счётчик результатов */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 16px 0' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Найдено <b style={{ color: '#111827' }}>{resultCount}</b> объявлений
        </span>
      </div>
    </>
  );
}
