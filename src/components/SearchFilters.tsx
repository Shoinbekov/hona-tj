'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { SearchFilters } from '@/types';
import { DISTRICTS } from '@/lib/data';

const BLUE = '#1a56db';
const BORDER = '#d1d5db';
const CTRL: React.CSSProperties = {
  height: 40, border: `1px solid ${BORDER}`, borderRadius: 6,
  fontSize: 14, color: '#111827', background: '#fff',
  padding: '0 10px', outline: 'none', width: '100%',
};

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  resultCount: number;
}

export default function SearchSection({ filters, onChange, resultCount }: Props) {
  const { currency } = useLanguage();
  const set = (k: keyof SearchFilters, v: string) => onChange({ ...filters, [k]: v });

  return (
    <>
      {/* Search bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 0', position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Купить / Снять */}
          <select value={filters.listingType} onChange={e => set('listingType', e.target.value)} style={{ ...CTRL, minWidth: 130, flex: '0 0 130px' }}>
            <option value="all">Купить/Снять</option>
            <option value="sale">Купить</option>
            <option value="rent">Снять</option>
          </select>

          {/* Тип жилья */}
          <select value={filters.propertyType} onChange={e => set('propertyType', e.target.value)} style={{ ...CTRL, minWidth: 140, flex: '0 0 140px' }}>
            <option value="all">Тип жилья</option>
            <option value="apartment">Квартира</option>
            <option value="house">Дом</option>
            <option value="commercial">Коммерческая</option>
            <option value="land">Земля</option>
          </select>

          {/* Район */}
          <select value={filters.district} onChange={e => set('district', e.target.value)} style={{ ...CTRL, minWidth: 150, flex: '0 0 150px' }}>
            <option value="">Район</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Комнаты */}
          <select value={filters.rooms} onChange={e => set('rooms', e.target.value)} style={{ ...CTRL, minWidth: 110, flex: '0 0 110px' }}>
            <option value="">Комнаты</option>
            <option value="1">1 комната</option>
            <option value="2">2 комнаты</option>
            <option value="3">3 комнаты</option>
            <option value="4">4+ комнат</option>
          </select>

          {/* Price from */}
          <input
            type="number" placeholder={`Цена от (${currency})`} value={filters.minPrice}
            onChange={e => set('minPrice', e.target.value)}
            style={{ ...CTRL, minWidth: 120, flex: '1 1 120px' }}
          />

          {/* Price to */}
          <input
            type="number" placeholder={`Цена до (${currency})`} value={filters.maxPrice}
            onChange={e => set('maxPrice', e.target.value)}
            style={{ ...CTRL, minWidth: 120, flex: '1 1 120px' }}
          />

          {/* Find button */}
          <button
            style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, height: 40, padding: '0 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Найти
          </button>

          {/* Reset */}
          {(filters.listingType !== 'all' || filters.propertyType !== 'all' || filters.district || filters.rooms || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={() => onChange({ query: '', listingType: 'all', propertyType: 'all', district: '', minPrice: '', maxPrice: '', rooms: '', currency })}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer', padding: '0 4px', whiteSpace: 'nowrap', textDecoration: 'underline' }}>
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 16px 0' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Найдено <b style={{ color: '#111827' }}>{resultCount}</b> объявлений
        </span>
      </div>
    </>
  );
}
