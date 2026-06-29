'use client';

import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1e293b', color: '#94a3b8', marginTop: 48 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>

        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Хона.тж</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>Недвижимость Таджикистана. Покупка, аренда и продажа.</p>
          <a href="https://wa.me/992900000000" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#25d366', color: '#fff', borderRadius: 6, padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>

        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Недвижимость</div>
          {['Квартиры', 'Дома', 'Коммерческая', 'Земельные участки'].map(l => (
            <Link key={l} href="/" style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>

        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Районы</div>
          {['Сино', 'Фирдавси', 'Исмоили Сомони', 'Шохмансур'].map(d => (
            <Link key={d} href={`/?district=${d}`} style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8, textDecoration: 'none' }}>{d}</Link>
          ))}
        </div>

        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Контакты</div>
          <div style={{ fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={13} /> +992 (44) 600-00-00
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>info@hona.tj</div>
          <div style={{ fontSize: 13 }}>Душанбе, Таджикистан</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px', textAlign: 'center', fontSize: 12, color: '#475569', maxWidth: 1200, margin: '0 auto' }}>
        © 2024 Хона.тж — Все права защищены
      </div>
    </footer>
  );
}
