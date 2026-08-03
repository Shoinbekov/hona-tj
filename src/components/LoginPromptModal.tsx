'use client';

import Link from 'next/link';

const BLUE = '#1a56db';

export default function LoginPromptModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 340, margin: '0 16px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', padding: 24, textAlign: 'center' }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 18 }}>
          Войдите, чтобы добавить в избранное
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Link
            href="/login"
            onClick={onClose}
            style={{ background: BLUE, color: '#fff', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            Войти
          </Link>
          <button
            onClick={onClose}
            style={{ background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
