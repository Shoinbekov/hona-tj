'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DASHBOARD_LISTINGS, formatPrice, getPriceInCurrency } from '@/lib/data';
import { Eye, MessageCircle, Edit3, Trash2, ToggleLeft, ToggleRight, BarChart3, Bell, Settings, LogOut, Home, Star, TrendingUp } from 'lucide-react';

const BLUE  = '#1a56db';
const GREEN = '#16a34a';

type Tab = 'listings' | 'stats' | 'notifications' | 'settings';

export default function DashboardPage() {
  const { currency, rates } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('listings');
  const [items, setItems] = useState(DASHBOARD_LISTINGS.map(l => ({ ...l, active: true })));

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const toggle = (id: string) => setItems(p => p.map(l => l.id === id ? { ...l, active: !l.active } : l));
  const remove = (id: string) => { if (confirm('Удалить объявление?')) setItems(p => p.filter(l => l.id !== id)); };

  const totalViews     = items.reduce((s, l) => s + l.myViews, 0);
  const totalInquiries = items.reduce((s, l) => s + l.myInquiries, 0);
  const activeCount    = items.filter(l => l.active).length;

  const STATS = [
    { label: 'Объявлений',  val: items.length,                 icon: Home,          bg: '#dbeafe', ic: BLUE      },
    { label: 'Активных',    val: activeCount,                   icon: ToggleRight,   bg: '#dcfce7', ic: GREEN     },
    { label: 'Просмотров',  val: totalViews.toLocaleString(),   icon: Eye,           bg: '#f3e8ff', ic: '#7c3aed' },
    { label: 'Запросов',    val: totalInquiries,                icon: MessageCircle, bg: '#fef3c7', ic: '#d97706' },
  ];

  const SIDE: { id: Tab; icon: typeof Home; label: string; badge?: number }[] = [
    { id: 'listings',      icon: Home,      label: 'Мои объявления' },
    { id: 'stats',         icon: BarChart3, label: 'Статистика' },
    { id: 'notifications', icon: Bell,      label: 'Уведомления', badge: 3 },
    { id: 'settings',      icon: Settings,  label: 'Настройки' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <div style={{ paddingTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 48px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <aside style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }} className="dash-sidebar">
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 20, textAlign: 'center' }}>
              {(() => {
                const name  = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Пользователь';
                const email = user.email ?? '';
                const init  = name[0]?.toUpperCase() ?? 'П';
                return (
                  <>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, margin: '0 auto 10px' }}>{init}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{email}</div>
                  </>
                );
              })()}
            </div>

            <nav style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '6px 0' }}>
              {SIDE.map(({ id, icon: Icon, label, badge }) => (
                <button key={id} onClick={() => setTab(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: 'none', background: tab === id ? '#eff6ff' : 'transparent', color: tab === id ? BLUE : '#374151', fontSize: 14, fontWeight: tab === id ? 600 : 400, cursor: 'pointer', textAlign: 'left', borderLeft: `3px solid ${tab === id ? BLUE : 'transparent'}` }}>
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge && <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>}
                </button>
              ))}
              <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />
              <button onClick={async () => { await signOut(); router.push('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#dc2626', fontSize: 14, background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                <LogOut size={16} /> Выйти
              </button>
            </nav>
          </aside>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Личный кабинет</h1>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="stat-grid">
              {STATS.map(({ label, val, icon: Icon, bg, ic }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={ic} />
                    </div>
                    <TrendingUp size={14} color="#22c55e" />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{val}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Mobile tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 4, marginBottom: 16, overflowX: 'auto' }} className="dash-tabs">
              {SIDE.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setTab(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 12px', borderRadius: 6, border: 'none', background: tab === id ? BLUE : 'transparent', color: tab === id ? '#fff' : '#6b7280', fontSize: 12, fontWeight: tab === id ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {/* LISTINGS */}
            {tab === 'listings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(l => {
                  const price = formatPrice(getPriceInCurrency(l, currency, rates), currency);
                  return (
                    <div key={l.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 14, display: 'flex', gap: 14, opacity: l.active ? 1 : 0.55 }}>
                      <div style={{ width: 96, height: 72, borderRadius: 6, overflow: 'hidden', background: '#e5e7eb', flexShrink: 0, position: 'relative' }}>
                        <img src={l.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {!l.active && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>СКРЫТО</span>
                        </div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title.ru}</span>
                          <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: l.active ? '#dcfce7' : '#f3f4f6', color: l.active ? '#166534' : '#6b7280' }}>
                            {l.active ? 'Активно' : 'Скрыто'}
                          </span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: BLUE, marginBottom: 5 }}>
                          {price}{l.listingType === 'rent' && <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>/мес</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> {l.myViews} просм.</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MessageCircle size={12} /> {l.myInquiries} зап.</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {[
                            { label: 'Смотреть',      onClick: undefined, href: `/property/${l.id}`, icon: Eye },
                            { label: 'Редактировать', onClick: undefined, href: undefined,           icon: Edit3 },
                          ].map(({ label, href, icon: Ic }) => href
                            ? <Link key={label} href={href} style={actionBtn}><Ic size={12} />{label}</Link>
                            : <button key={label} style={actionBtnEl}><Ic size={12} />{label}</button>
                          )}
                          <button onClick={() => toggle(l.id)} style={actionBtnEl}>
                            {l.active ? <><ToggleRight size={12} color={GREEN} /> Скрыть</> : <><ToggleLeft size={12} /> Показать</>}
                          </button>
                          <button onClick={() => remove(l.id)} style={{ ...actionBtnEl, borderColor: '#fecaca', color: '#ef4444', marginLeft: 'auto' }}>
                            <Trash2 size={12} /> Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ color: '#6b7280', marginBottom: 12 }}>Нет объявлений</p>
                    <Link href="/add-listing" style={{ background: BLUE, color: '#fff', padding: '10px 20px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Подать объявление</Link>
                  </div>
                )}
              </div>
            )}

            {/* STATS */}
            {tab === 'stats' && (
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 24 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Просмотры за 30 дней</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {items.map(l => (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={l.images[0]} alt="" style={{ width: 48, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title.ru}</div>
                        <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: BLUE, borderRadius: 3, width: `${Math.min((l.myViews/700)*100,100)}%` }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 40 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{l.myViews}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>просм.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { text: 'Ваше объявление просмотрели 12 раз сегодня', time: '2 ч. назад', bg: '#dbeafe', ic: BLUE },
                  { text: 'Новый запрос по объявлению «3-комнатная квартира в центре»', time: '4 ч. назад', bg: '#dcfce7', ic: GREEN, dot: true },
                  { text: 'Ваше объявление добавили в избранное', time: 'Вчера', bg: '#fef2f2', ic: '#ef4444' },
                  { text: 'Клиент оставил отзыв — 5 звёзд', time: '2 дня назад', bg: '#fef3c7', ic: '#d97706' },
                ].map((n, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                      <Bell size={16} color={n.ic} />
                      {n.dot && <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#374151' }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS */}
            {tab === 'settings' && (
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 24 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Настройки профиля</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
                  {[{ label: 'Имя', val: 'Алишер Каримов', type: 'text' }, { label: 'Email', val: 'info@hona.tj', type: 'email' }, { label: 'Телефон', val: '+992 900 000 000', type: 'tel' }].map(({ label, val, type }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                      <input type={type} defaultValue={val} style={{ width: '100%', height: 40, border: '1px solid #d1d5db', borderRadius: 6, padding: '0 12px', fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                  ))}
                  <button style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>Сохранить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 860px) { .dash-sidebar { display: none !important; } .stat-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .stat-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}

const actionBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, color: '#374151', textDecoration: 'none' };
const actionBtnEl: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, color: '#374151', background: '#fff', cursor: 'pointer' };
