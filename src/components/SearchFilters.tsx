'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Currency } from '@/types';
import LocationPicker from '@/components/LocationPicker';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CATEGORIES, CategoryConfig, FilterState, FilterMode,
  defaultValues, getCategoryConfig,
} from '@/lib/filterConfig';
import {
  CTRL, FieldRenderer, RangeField, ToggleButtons, FieldValue,
} from '@/components/filters/FilterFields';

const BLUE   = '#1a56db';
const BORDER = '#d1d5db';

function currencySuffix(currency: Currency): string {
  if (currency === 'USD') return '$';
  if (currency === 'RUB') return 'руб.';
  return 'сом.';
}

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

export default function SmartFilter({ filters: f, onChange, resultCount }: Props) {
  const { currency } = useLanguage();
  const [showExtra, setShowExtra] = useState(false);

  const cfg = getCategoryConfig(f.mode, f.category);
  const tabs = CATEGORIES[f.mode];

  function set(id: string, v: FieldValue) {
    onChange({ ...f, values: { ...f.values, [id]: v } });
  }

  function switchMode(mode: FilterMode) {
    if (mode === f.mode) return;
    const nextCfg = CATEGORIES[mode][0];
    setShowExtra(false);
    onChange({
      ...f, mode, category: nextCfg.key,
      minPrice: '', maxPrice: '', priceUnit: nextCfg.price?.unitOptions?.[0].value ?? 'total',
      values: defaultValues(nextCfg),
    });
  }

  function switchCategory(next: CategoryConfig) {
    if (next.key === f.category) return;
    setShowExtra(false);
    onChange({
      ...f, category: next.key,
      minPrice: '', maxPrice: '', priceUnit: next.price?.unitOptions?.[0].value ?? 'total',
      values: defaultValues(next),
    });
  }

  function clearAll() {
    setShowExtra(false);
    onChange({
      ...f, city: 'tj', district: '', minPrice: '', maxPrice: '', query: '',
      priceUnit: cfg.price?.unitOptions?.[0].value ?? 'total',
      values: defaultValues(cfg),
    });
  }

  const hasReset =
    f.city !== 'tj' || !!f.district || !!f.minPrice || !!f.maxPrice || !!f.query ||
    Object.values(f.values).some(v => Array.isArray(v) ? v.length > 0 : (typeof v === 'boolean' ? v : !!v));

  const hasExtra = cfg.extra.length > 0 || cfg.extraCheckboxes.length > 0;

  const findBtn = (
    <button type="button" style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, height: 40, padding: '0 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
      Показать результаты ({resultCount})
    </button>
  );

  return (
    <>
      <div style={{ background: '#f3f4f6', padding: '10px 0', position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '12px 14px' }}>

            {/* ── Базовая строка: режим + категория + поля вплотную ─────── */}
            <div className="ff-row" style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flexWrap: 'wrap' }}>

              <select value={f.mode} onChange={e => switchMode(e.target.value as FilterMode)}
                style={{ ...CTRL, minWidth: 104, flex: '0 0 104px', fontWeight: 600, color: BLUE }}>
                <option value="sale">Купить</option>
                <option value="rent">Аренда</option>
              </select>

              <select value={f.category} onChange={e => { const next = tabs.find(t => t.key === e.target.value); if (next) switchCategory(next); }}
                style={{ ...CTRL, minWidth: 168, flex: '0 0 168px' }}>
                {tabs.map(t => <option key={t.key} value={t.key}>{t.tabLabel}</option>)}
              </select>

              {cfg.base.map(field => (
                <FieldRenderer key={field.id} field={field} values={f.values} set={set} />
              ))}

              <LocationPicker
                city={f.city}
                district={f.district}
                onChange={(c, d) => onChange({ ...f, city: c, district: d })}
                buttonStyle={{ minWidth: 168, flex: '0 0 168px' }}
              />

              {cfg.hasPrice && (
                <>
                  {cfg.price?.unitOptions && (
                    <ToggleButtons
                      options={cfg.price.unitOptions}
                      value={f.priceUnit}
                      onChange={v => onChange({ ...f, priceUnit: (v as string) || cfg.price!.unitOptions![0].value })}
                    />
                  )}
                  <RangeField
                    from={f.minPrice} to={f.maxPrice} unit={currencySuffix(currency)}
                    onFrom={v => onChange({ ...f, minPrice: v })}
                    onTo={v => onChange({ ...f, maxPrice: v })}
                  />
                </>
              )}

              {!showExtra && findBtn}

              <Link href="/map" style={{ background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 6, height: 40, padding: '0 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                На карте
              </Link>
            </div>

            {/* ── Чекбоксы базовой строки ────────────────── */}
            {cfg.baseCheckboxes.length > 0 && (
              <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                {cfg.baseCheckboxes.map(field => (
                  <FieldRenderer key={field.id} field={field} values={f.values} set={set} />
                ))}
              </div>
            )}

            {/* ── Ещё настройки ───────────────────────────── */}
            {hasExtra && showExtra && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f2f4' }}>
                {cfg.extra.length > 0 && (
                  <div className="ff-grid">
                    {cfg.extra.map(field => (
                      <FieldRenderer key={field.id} field={field} values={f.values} set={set} fill />
                    ))}
                  </div>
                )}
                {cfg.extraCheckboxes.length > 0 && (
                  <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                    {cfg.extraCheckboxes.map(field => (
                      <FieldRenderer key={field.id} field={field} values={f.values} set={set} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Поиск по тексту ─────────────────────────── */}
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                placeholder="Поиск по тексту объявления"
                value={f.query}
                onChange={e => onChange({ ...f, query: e.target.value })}
                style={{ ...CTRL, width: '100%' }}
              />
            </div>

            {/* ── Действия ────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginTop: 10, gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {hasReset && (
                  <button type="button" onClick={clearAll}
                    style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 12.5, cursor: 'pointer', padding: 0, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                    Очистить всё
                  </button>
                )}
                {hasExtra && (
                  <button type="button" onClick={() => setShowExtra(s => !s)}
                    style={{ background: 'none', border: 'none', color: BLUE, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                    {showExtra ? 'Скрыть настройки' : 'Ещё настройки'}
                    <span style={{ display: 'inline-block', transform: showExtra ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
                  </button>
                )}
              </div>

              <div style={{ justifySelf: 'center' }}>{showExtra && findBtn}</div>

              <div />
            </div>

          </div>
        </div>
      </div>

      {/* Счётчик результатов */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px 0' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Найдено <b style={{ color: '#111827' }}>{resultCount}</b> объявлений
        </span>
      </div>

      <style>{`
        .ff-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px 16px;
          align-items: end;
        }
        @media (max-width: 860px) {
          .ff-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 540px) {
          .ff-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
