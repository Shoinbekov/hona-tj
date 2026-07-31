'use client';

import { useEffect, useRef, useState } from 'react';
import { FieldDef, Option } from '@/lib/filterConfig';

const BLUE   = '#1a56db';
const BORDER = '#d1d5db';

export const CTRL: React.CSSProperties = {
  height: 40, border: `1px solid ${BORDER}`, borderRadius: 6,
  fontSize: 14, color: '#111827', background: '#fff',
  padding: '0 10px', outline: 'none', width: '100%',
};
export const SMALL: React.CSSProperties = { ...CTRL, width: 88, minWidth: 0, padding: '0 8px' };

export type FieldValue = string | string[] | boolean;
export type ValueBag = Record<string, FieldValue>;

// ─── Dropdown shell: trigger button + click-outside-closing panel ─────────

function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onClose]);
  return ref;
}

function Chevron() {
  return (
    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 1l4.5 4.5L10 1" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── rooms: multi-select numbered buttons + "N+" ───────────────────────────

export function RoomButtons({ max, value, onChange }: { max: number; value: string[]; onChange: (v: string[]) => void }) {
  const nums = Array.from({ length: max - 1 }, (_, i) => String(i + 1));
  const buckets = [...nums, `${max}+`];
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  }
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {buckets.map(v => {
        const active = value.includes(v);
        return (
          <button key={v} type="button" onClick={() => toggle(v)}
            style={{
              width: 38, height: 38, borderRadius: 6, fontSize: 13, cursor: 'pointer',
              border: `1px solid ${active ? BLUE : BORDER}`,
              background: active ? BLUE : '#fff', color: active ? '#fff' : '#374151',
              fontWeight: active ? 600 : 400, flexShrink: 0,
            }}>
            {v}
          </button>
        );
      })}
    </div>
  );
}

// ─── buttons: toggle button group, single or multi ─────────────────────────

export function ToggleButtons({ options, value, multi, onChange }: {
  options: Option[]; value: FieldValue; multi?: boolean; onChange: (v: FieldValue) => void;
}) {
  const arr = multi ? (value as string[]) : null;
  function click(v: string) {
    if (multi) {
      onChange(arr!.includes(v) ? arr!.filter(x => x !== v) : [...arr!, v]);
    } else {
      onChange(value === v ? '' : v);
    }
  }
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map(o => {
        const active = multi ? arr!.includes(o.value) : value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => click(o.value)}
            style={{
              height: 38, padding: '0 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
              border: `1px solid ${active ? BLUE : BORDER}`,
              background: active ? BLUE : '#fff', color: active ? '#fff' : '#374151',
              fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── select: plain native dropdown ──────────────────────────────────────────

export function SelectField({ options, value, onChange, width, fill }: {
  options: Option[]; value: string; onChange: (v: string) => void; width?: number; fill?: boolean;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={fill
        ? { ...CTRL, width: '100%' }
        : { ...CTRL, width: width ?? 170, minWidth: width ?? 170, flexShrink: 0, flexGrow: 0 }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── multiselect: dropdown trigger + checkbox list, "Не важно" clears ─────

export function MultiSelectDropdown({ label, options, value, onChange, width, fill }: {
  label: string; options: Option[]; value: string[]; onChange: (v: string[]) => void; width?: number; fill?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const real = options.filter(o => o.value !== '');

  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  }

  const text = value.length === 0 ? label : value.length === 1
    ? (real.find(o => o.value === value[0])?.label ?? label)
    : `${label}: ${value.length}`;

  return (
    <div ref={ref} style={fill
      ? { position: 'relative', width: '100%' }
      : { position: 'relative', flex: `0 0 ${width ?? 190}px`, minWidth: width ?? 190 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{
          ...CTRL, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          color: value.length ? '#111827' : '#6b7280', justifyContent: 'space-between',
        }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
        <Chevron />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: '100%', width: 260,
          background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, maxHeight: 320, overflowY: 'auto', padding: 6,
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', fontSize: 14, color: '#374151', cursor: 'pointer', borderBottom: `1px solid #f3f4f6`, marginBottom: 4 }}>
            <input type="checkbox" checked={value.length === 0} onChange={() => onChange([])} style={{ width: 15, height: 15, cursor: 'pointer' }} />
            Не важно
          </label>
          {real.map(o => (
            <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', fontSize: 14, color: '#374151', cursor: 'pointer' }}>
              <input type="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} style={{ width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }} />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── range: От–До numeric pair ──────────────────────────────────────────────

export function RangeField({ from, to, unit, onFrom, onTo, fill }: {
  from: string; to: string; unit?: string; onFrom: (v: string) => void; onTo: (v: string) => void; fill?: boolean;
}) {
  const inputStyle = fill ? { ...SMALL, width: '100%', flex: 1, minWidth: 0 } : SMALL;
  const noNegative = (v: string) => v.replace('-', '');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: fill ? undefined : 0, width: fill ? '100%' : undefined }}>
      <input type="number" min="0" placeholder="От" value={from} onChange={e => onFrom(noNegative(e.target.value))} style={inputStyle} />
      <span style={{ fontSize: 14, color: '#9ca3af', flexShrink: 0 }}>—</span>
      <input type="number" min="0" placeholder="До" value={to} onChange={e => onTo(noNegative(e.target.value))} style={inputStyle} />
      {unit && <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{unit}</span>}
    </div>
  );
}

// ─── text: free-text search-like input ──────────────────────────────────────

export function TextField({ placeholder, value, onChange, width, fill }: {
  placeholder?: string; value: string; onChange: (v: string) => void; width?: number; fill?: boolean;
}) {
  return (
    <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={fill
        ? { ...CTRL, width: '100%' }
        : { ...CTRL, width: width ?? 180, minWidth: width ?? 180, flexShrink: 0, flexGrow: 0 }} />
  );
}

// ─── checkbox ────────────────────────────────────────────────────────────

export function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#4b5563', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 14, height: 14, cursor: 'pointer' }} />
      {label}
    </label>
  );
}

// ─── Field label wrapper (adds a small caption above a control when needed) ─

export function FieldWithLabel({ label, children, fill }: { label?: string; children: React.ReactNode; fill?: boolean }) {
  if (!label) return <>{children}</>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: fill ? undefined : 0, width: fill ? '100%' : undefined }}>
      <span style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1 }}>{label}</span>
      {children}
    </div>
  );
}

// ─── Generic dispatcher: renders one FieldDef against a value bag ──────────

export function FieldRenderer({ field, values, set, fill }: {
  field: FieldDef; values: ValueBag; set: (id: string, v: FieldValue) => void; fill?: boolean;
}) {
  switch (field.kind) {
    case 'rooms':
      return (
        <FieldWithLabel label={field.label} fill={fill}>
          <RoomButtons max={field.maxRooms ?? 5} value={(values[field.id] as string[]) ?? []} onChange={v => set(field.id, v)} />
        </FieldWithLabel>
      );
    case 'buttons':
      return (
        <FieldWithLabel label={field.label} fill={fill}>
          <ToggleButtons options={field.options ?? []} value={values[field.id]} multi={field.multi} onChange={v => set(field.id, v)} />
        </FieldWithLabel>
      );
    case 'select':
      return (
        <FieldWithLabel label={field.label} fill={fill}>
          <SelectField options={field.options ?? []} value={(values[field.id] as string) ?? ''} onChange={v => set(field.id, v)} fill={fill} />
        </FieldWithLabel>
      );
    case 'multiselect':
      return (
        <MultiSelectDropdown
          label={field.label ?? ''}
          options={field.options ?? []}
          value={(values[field.id] as string[]) ?? []}
          onChange={v => set(field.id, v)}
          fill={fill}
        />
      );
    case 'range':
      return (
        <FieldWithLabel label={field.label} fill={fill}>
          <RangeField
            from={(values[`${field.id}From`] as string) ?? ''}
            to={(values[`${field.id}To`] as string) ?? ''}
            unit={field.unit}
            onFrom={v => set(`${field.id}From`, v)}
            onTo={v => set(`${field.id}To`, v)}
            fill={fill}
          />
        </FieldWithLabel>
      );
    case 'text':
      return (
        <FieldWithLabel label={field.label} fill={fill}>
          <TextField placeholder={field.placeholder} value={(values[field.id] as string) ?? ''} onChange={v => set(field.id, v)} fill={fill} />
        </FieldWithLabel>
      );
    case 'checkbox':
      return <CheckboxField label={field.label ?? ''} checked={!!values[field.id]} onChange={v => set(field.id, v)} />;
    default:
      return null;
  }
}
