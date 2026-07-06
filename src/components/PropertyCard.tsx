'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, getPriceInCurrency } from '@/lib/data';
import { Property } from '@/types';
import { MapPin, BedDouble, Maximize2, Layers, Phone, MessageCircle } from 'lucide-react';

const BLUE  = '#1a56db';
const GREEN = '#16a34a';

export default function PropertyCard({ property: p }: { property: Property }) {
  const { currency } = useLanguage();

  const price = formatPrice(getPriceInCurrency(p, currency), currency);
  const isRent = p.listingType === 'rent';

  const openWA = (e: React.MouseEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Здравствуйте! Меня интересует: ${p.title.ru}`);
    window.open(`https://wa.me/${p.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <article className="prop-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/property/${p.id}`} style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
        {/* Photo */}
        <div style={{ height: 220, overflow: 'hidden', background: '#e5e7eb', position: 'relative' }}>
          <img
            src={p.images[0]}
            alt={p.title.ru}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* Badge: type */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: isRent ? BLUE : GREEN,
            color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '3px 8px', borderRadius: 4,
          }}>
            {isRent ? 'Аренда' : 'Продажа'}
          </span>

          {/* TOP badge */}
          {p.isTop && (
            <span style={{ position: 'absolute', top: 10, right: 10, background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
              ТОП
            </span>
          )}
          {!p.isTop && p.isNew && (
            <span style={{ position: 'absolute', top: 10, right: 10, background: '#8b5cf6', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
              НОВОЕ
            </span>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: 12 }}>
          {/* Price */}
          <div style={{ fontSize: 20, fontWeight: 700, color: BLUE, lineHeight: 1.2 }}>
            {price}
            {isRent && <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 4 }}>/мес</span>}
          </div>

          {/* Title */}
          <div className="clamp2" style={{ fontSize: 14, color: '#111827', marginTop: 4, lineHeight: 1.4, fontWeight: 500 }}>
            {p.title.ru}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            {p.rooms > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#6b7280' }}>
                <BedDouble size={13} color="#9ca3af" />{p.rooms} комн.
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#6b7280' }}>
              <Maximize2 size={13} color="#9ca3af" />{p.area} м²
            </span>
            {(p.floor ?? 0) > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#6b7280' }}>
                <Layers size={13} color="#9ca3af" />{p.floor}/{p.totalFloors} эт.
              </span>
            )}
          </div>

          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <MapPin size={12} color="#9ca3af" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.address.ru}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#f3f4f6', margin: '10px 0' }} />

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={openWA}
              style={{ flex: 1, background: GREEN, color: '#fff', border: 'none', borderRadius: 6, height: 36, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <MessageCircle size={14} />
              WhatsApp
            </button>
            <a
              href={`tel:${p.phone}`}
              onClick={e => e.stopPropagation()}
              style={{ flex: 1, background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 6, height: 36, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, textDecoration: 'none' }}>
              <Phone size={14} />
              Позвонить
            </a>
          </div>
        </div>
      </Link>
    </article>
  );
}
