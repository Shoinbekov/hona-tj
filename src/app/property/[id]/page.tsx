'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PROPERTIES, formatPrice } from '@/lib/data';
import {
  ArrowLeft, MapPin, BedDouble, Maximize2, Layers, Eye, Phone,
  MessageCircle, Heart, Share2, Check, ChevronLeft, ChevronRight, Calendar, Star,
} from 'lucide-react';

const BLUE  = '#1a56db';
const GREEN = '#16a34a';

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currency } = useLanguage();
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);

  const p = MOCK_PROPERTIES.find(x => x.id === id);

  if (!p) return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <div style={{ paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>Объявление не найдено</p>
        <Link href="/" style={{ background: BLUE, color: '#fff', padding: '10px 20px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>На главную</Link>
      </div>
    </div>
  );

  const price  = currency === 'USD' ? formatPrice(p.priceUSD, 'USD') : formatPrice(p.priceTJS, 'TJS');
  const isRent = p.listingType === 'rent';
  const prev   = () => setImgIdx(i => (i - 1 + p.images.length) % p.images.length);
  const next   = () => setImgIdx(i => (i + 1) % p.images.length);
  const openWA = () => {
    const msg = encodeURIComponent(`Здравствуйте! Меня интересует: ${p.title.ru} (${p.address.ru})`);
    window.open(`https://wa.me/${p.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  const typeLabel = ({ apartment: 'Квартира', house: 'Дом', commercial: 'Коммерческая', land: 'Земля', garage: 'Гараж', room: 'Комната' } as Record<string, string>)[p.type] ?? p.type;

  const specs = [
    { label: 'Тип объекта',   val: typeLabel },
    { label: 'Тип сделки',    val: isRent ? 'Аренда' : 'Продажа' },
    { label: 'Площадь',       val: `${p.area} м²` },
    ...(p.rooms > 0         ? [{ label: 'Комнат',          val: String(p.rooms) }] : []),
    ...(p.floor             ? [{ label: 'Этаж',            val: `${p.floor} из ${p.totalFloors}` }] : []),
    { label: 'Район',         val: p.district },
    { label: 'Адрес',         val: p.address.ru },
    { label: 'Опубликовано',  val: new Date(p.createdAt).toLocaleDateString('ru-RU') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <div style={{ paddingTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px 48px' }}>

          {/* Back */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13, textDecoration: 'none', marginBottom: 16 }}>
            <ArrowLeft size={14} /> Назад к списку
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }} className="detail-grid">

            {/* ── LEFT ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Gallery */}
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 420, background: '#e5e7eb' }}>
                  <img src={p.images[imgIdx]} alt={p.title.ru} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {p.images.length > 1 && <>
                    <button onClick={prev} style={arrowBtn('left')}>
                      <ChevronLeft size={20} color="#374151" />
                    </button>
                    <button onClick={next} style={arrowBtn('right')}>
                      <ChevronRight size={20} color="#374151" />
                    </button>
                    <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 12, borderRadius: 20, padding: '3px 10px' }}>
                      {imgIdx + 1} / {p.images.length}
                    </span>
                  </>}
                  <span style={{ position: 'absolute', top: 12, left: 12, background: isRent ? BLUE : GREEN, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>
                    {isRent ? 'Аренда' : 'Продажа'}
                  </span>
                </div>
                {p.images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, padding: '10px 12px', background: '#f9fafb', borderTop: '1px solid #f3f4f6', overflowX: 'auto' }}>
                    {p.images.map((img, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        style={{ flexShrink: 0, width: 72, height: 50, borderRadius: 6, overflow: 'hidden', border: `2px solid ${i === imgIdx ? BLUE : 'transparent'}`, cursor: 'pointer', padding: 0, opacity: i === imgIdx ? 1 : 0.6 }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={card}>
                <h2 style={sectionTitle}>Описание</h2>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{p.description.ru}</p>
              </div>

              {/* Specs */}
              <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6' }}>
                  <h2 style={{ ...sectionTitle, margin: 0 }}>Характеристики</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {specs.map(({ label, val }, i) => (
                      <tr key={label} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <td style={{ padding: '11px 20px', fontSize: 13, color: '#6b7280', width: '45%', borderBottom: '1px solid #f3f4f6' }}>{label}</td>
                        <td style={{ padding: '11px 20px', fontSize: 13, color: '#111827', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Features */}
              {p.features.length > 0 && (
                <div style={card}>
                  <h2 style={sectionTitle}>Удобства</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 16px' }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={10} color={BLUE} />
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT (sticky) ── */}
            <div style={{ position: 'sticky', top: 76, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={card}>
                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: BLUE, lineHeight: 1.1 }}>
                      {price}{isRent && <span style={{ fontSize: 14, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>/мес</span>}
                    </div>
                    <span style={{ display: 'inline-block', marginTop: 6, background: isRent ? '#dbeafe' : '#dcfce7', color: isRent ? BLUE : '#166534', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                      {isRent ? 'Аренда' : 'Продажа'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setLiked(!liked)}
                      style={{ width: 36, height: 36, border: '1px solid #e5e7eb', borderRadius: 6, background: liked ? '#fef2f2' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={16} color={liked ? '#ef4444' : '#9ca3af'} fill={liked ? '#ef4444' : 'none'} />
                    </button>
                    <button onClick={() => navigator.clipboard?.writeText(window.location.href)}
                      style={{ width: 36, height: 36, border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={16} color="#9ca3af" />
                    </button>
                  </div>
                </div>

                <h1 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 6, lineHeight: 1.4 }}>{p.title.ru}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  <MapPin size={12} color="#9ca3af" />
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{p.address.ru}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                  {p.rooms > 0 && <span style={meta}><BedDouble size={13} color="#9ca3af" /> {p.rooms} комн.</span>}
                  <span style={meta}><Maximize2 size={13} color="#9ca3af" /> {p.area} м²</span>
                  {(p.floor ?? 0) > 0 && <span style={meta}><Layers size={13} color="#9ca3af" /> {p.floor}/{p.totalFloors} эт.</span>}
                </div>

                <div style={{ height: 1, background: '#f3f4f6', marginBottom: 16 }} />

                {/* Agent */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                    {p.agentName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{p.agentName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={11} color="#f59e0b" fill={s <= 4 ? '#f59e0b' : 'none'} />)}
                      <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>4.8 · 23 сделки</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={openWA} style={{ background: '#25d366', color: '#fff', border: 'none', borderRadius: 6, height: 44, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <MessageCircle size={16} /> Написать в WhatsApp
                  </button>
                  <a href={`tel:${p.phone}`} style={{ background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 6, height: 44, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}>
                    <Phone size={16} /> Позвонить
                  </a>
                </div>

                <div style={{ height: 1, background: '#f3f4f6', margin: '16px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: Eye,      text: `${p.views} просмотров` },
                    { icon: Calendar, text: `Опубликовано ${new Date(p.createdAt).toLocaleDateString('ru-RU')}` },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af' }}>
                      <Icon size={13} /> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="detail-mobile-cta" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', padding: '10px 16px', gap: 10, zIndex: 40 }}>
        <button onClick={openWA} style={{ flex: 1, background: '#25d366', color: '#fff', border: 'none', borderRadius: 6, height: 44, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <MessageCircle size={16} /> WhatsApp
        </button>
        <a href={`tel:${p.phone}`} style={{ flex: 1, background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 6, height: 44, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Phone size={16} /> Позвонить
        </a>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .detail-mobile-cta { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

const card: React.CSSProperties = { background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 20 };
const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 };
const meta: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' };
const arrowBtn = (side: 'left'|'right'): React.CSSProperties => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: 10, width: 36, height: 36, borderRadius: '50%',
  background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
});
