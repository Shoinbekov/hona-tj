'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Building2, Briefcase, TreePine, Check, Phone, MessageCircle, MapPin, DollarSign, Camera } from 'lucide-react';

const BLUE   = '#1a56db';
const GREEN  = '#16a34a';
const BORDER = '#d1d5db';

const STEPS = ['Тип объекта', 'Адрес и цена', 'Описание', 'Контакты'];
const DISTRICTS = ['Сино', 'Фирдавси', 'Исмоили Сомони', 'Шохмансур'];
const FEATURES_LIST = ['Мебель', 'Интернет', 'Кондиционер', 'Отопление', 'Лифт', 'Парковка', 'Балкон', 'Евроремонт', 'Бытовая техника', 'Охрана'];

const TYPES = [
  { val: 'apartment', label: 'Квартира',      icon: Building2, desc: 'Апартаменты' },
  { val: 'house',     label: 'Дом',            icon: Home,      desc: 'Частный дом' },
  { val: 'commercial',label: 'Коммерческая',   icon: Briefcase, desc: 'Офис, склад' },
  { val: 'land',      label: 'Земля',          icon: TreePine,  desc: 'Участок' },
];

type Form = {
  type: string; deal: string; district: string; address: string;
  price: string; area: string; rooms: string; floor: string; floors: string;
  title: string; desc: string; phone: string; wa: string; features: string[];
};

const INIT: Form = { type:'apartment', deal:'sale', district:'', address:'', price:'', area:'', rooms:'', floor:'', floors:'', title:'', desc:'', phone:'', wa:'', features:[] };

const inp: React.CSSProperties = { height: 40, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '0 12px', fontSize: 14, color: '#111827', outline: 'none', width: '100%' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };

export default function AddListingPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Form>(INIT);

  const s = (k: keyof Form, v: string | string[]) => setForm(p => ({ ...p, [k]: v }));
  const toggleFeat = (f: string) => s('features', form.features.includes(f) ? form.features.filter(x => x !== f) : [...form.features, f]);

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <div style={{ paddingTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 40, maxWidth: 360, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Check size={28} color={GREEN} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Объявление отправлено!</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 24 }}>
            Будет опубликовано после проверки модератором — обычно в течение 1 часа.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/" style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '10px 0', textAlign: 'center', fontSize: 14, color: '#374151', textDecoration: 'none' }}>На главную</Link>
            <Link href="/dashboard" style={{ flex: 1, background: BLUE, color: '#fff', borderRadius: 6, padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Кабинет</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <div style={{ paddingTop: 60 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 48px' }}>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Подать объявление</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Шаг {step+1} из {STEPS.length}: {STEPS[step]}</p>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: BLUE, borderRadius: 2, width: `${((step+1)/STEPS.length)*100}%`, transition: 'width 0.3s' }} />
          </div>

          {/* Step pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < step ? GREEN : i === step ? BLUE : '#e5e7eb', color: i <= step ? '#fff' : '#9ca3af', transition: 'all 0.2s' }}>
                  {i < step ? <Check size={12} /> : i+1}
                </div>
                <span style={{ fontSize: 10, color: i === step ? BLUE : '#9ca3af', display: 'none' }} className="step-label">{s}</span>
              </div>
            ))}
          </div>

          <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 24 }}>

              {/* STEP 0 */}
              {step === 0 && <>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Тип недвижимости</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                  {TYPES.map(({ val, label, icon: Icon, desc }) => (
                    <button key={val} type="button" onClick={() => s('type', val)}
                      style={{ padding: 16, border: `2px solid ${form.type === val ? BLUE : BORDER}`, borderRadius: 8, background: form.type === val ? '#eff6ff' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: form.type === val ? BLUE : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <Icon size={18} color={form.type === val ? '#fff' : '#6b7280'} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: form.type === val ? BLUE : '#111827' }}>{label}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{desc}</div>
                    </button>
                  ))}
                </div>

                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Тип сделки</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                  {[{ val:'sale', label:'Продажа', sub:'Купить / продать' }, { val:'rent', label:'Аренда', sub:'Сдать / снять' }].map(({ val, label, sub }) => (
                    <button key={val} type="button" onClick={() => s('deal', val)}
                      style={{ padding: '14px 16px', border: `2px solid ${form.deal === val ? GREEN : BORDER}`, borderRadius: 8, background: form.deal === val ? '#f0fdf4' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: form.deal === val ? GREEN : '#111827' }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{sub}</div>
                    </button>
                  ))}
                </div>

                <button type="button" onClick={() => setStep(1)} style={{ width: '100%', height: 44, background: BLUE, color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Далее →
                </button>
              </>}

              {/* STEP 1 */}
              {step === 1 && <>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Адрес и цена</h2>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Район Душанбе</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {DISTRICTS.map(d => (
                      <button key={d} type="button" onClick={() => s('district', d)}
                        style={{ height: 40, border: `2px solid ${form.district === d ? BLUE : BORDER}`, borderRadius: 6, background: form.district === d ? '#eff6ff' : '#fff', fontSize: 13, fontWeight: form.district === d ? 600 : 400, color: form.district === d ? BLUE : '#374151', cursor: 'pointer' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Адрес</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} color="#9ca3af" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" value={form.address} onChange={e => s('address', e.target.value)} placeholder="Проспект Рудаки 42" style={{ ...inp, paddingLeft: 32 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={lbl}>Цена (USD)</label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={14} color="#9ca3af" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="number" value={form.price} onChange={e => s('price', e.target.value)} placeholder="50 000" style={{ ...inp, paddingLeft: 28 }} />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Площадь (м²)</label>
                    <input type="number" value={form.area} onChange={e => s('area', e.target.value)} placeholder="65" style={inp} />
                  </div>
                </div>

                {form.type !== 'land' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div>
                      <label style={lbl}>Комнат</label>
                      <input type="number" value={form.rooms} onChange={e => s('rooms', e.target.value)} placeholder="2" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Этаж</label>
                      <input type="number" value={form.floor} onChange={e => s('floor', e.target.value)} placeholder="5" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Всего эт.</label>
                      <input type="number" value={form.floors} onChange={e => s('floors', e.target.value)} placeholder="9" style={inp} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setStep(0)} style={{ height: 44, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '0 20px', fontSize: 14, color: '#374151', background: '#fff', cursor: 'pointer' }}>← Назад</button>
                  <button type="button" onClick={() => setStep(2)} style={{ flex: 1, height: 44, background: BLUE, color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Далее →</button>
                </div>
              </>}

              {/* STEP 2 */}
              {step === 2 && <>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Описание и фото</h2>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Заголовок</label>
                  <input type="text" value={form.title} onChange={e => s('title', e.target.value)} maxLength={100} placeholder="2-комнатная квартира в центре Душанбе" style={inp} />
                  <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginTop: 4 }}>{form.title.length}/100</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Описание</label>
                  <textarea value={form.desc} onChange={e => s('desc', e.target.value)} rows={5} maxLength={1000} placeholder="Опишите состояние, инфраструктуру, особенности..." style={{ ...inp, height: 'auto', padding: '10px 12px', resize: 'none', lineHeight: 1.6 }} />
                  <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginTop: 4 }}>{form.desc.length}/1000</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Удобства</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {FEATURES_LIST.map(f => (
                      <button key={f} type="button" onClick={() => toggleFeat(f)}
                        style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${form.features.includes(f) ? BLUE : BORDER}`, background: form.features.includes(f) ? BLUE : '#fff', color: form.features.includes(f) ? '#fff' : '#374151', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={lbl}>Фотографии</label>
                  <div style={{ border: `2px dashed ${BORDER}`, borderRadius: 8, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <Camera size={22} color={BLUE} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Нажмите для загрузки фото</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>PNG, JPG до 10 МБ · до 10 фото</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setStep(1)} style={{ height: 44, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '0 20px', fontSize: 14, color: '#374151', background: '#fff', cursor: 'pointer' }}>← Назад</button>
                  <button type="button" onClick={() => setStep(3)} style={{ flex: 1, height: 44, background: BLUE, color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Далее →</button>
                </div>
              </>}

              {/* STEP 3 */}
              {step === 3 && <>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Контакты</h2>

                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Телефон</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} color="#9ca3af" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="tel" value={form.phone} onChange={e => s('phone', e.target.value)} placeholder="+992 900 000 000" style={{ ...inp, paddingLeft: 32 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={lbl}>WhatsApp</label>
                  <div style={{ position: 'relative' }}>
                    <MessageCircle size={14} color="#9ca3af" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="tel" value={form.wa} onChange={e => s('wa', e.target.value)} placeholder="+992 900 000 000" style={{ ...inp, paddingLeft: 32 }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>WhatsApp — основной способ связи с покупателями</div>
                </div>

                {/* Summary */}
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Итого</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { k: 'Тип', v: TYPES.find(t => t.val === form.type)?.label + ' · ' + (form.deal === 'sale' ? 'Продажа' : 'Аренда') },
                      ...(form.district ? [{ k: 'Район', v: form.district }] : []),
                      ...(form.price    ? [{ k: 'Цена',  v: `$${parseInt(form.price||'0').toLocaleString()}` }] : []),
                      ...(form.area     ? [{ k: 'Площадь', v: `${form.area} м²` }] : []),
                    ].map(({ k, v }) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#9ca3af' }}>{k}</span>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setStep(2)} style={{ height: 44, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '0 20px', fontSize: 14, color: '#374151', background: '#fff', cursor: 'pointer' }}>← Назад</button>
                  <button type="submit" style={{ flex: 1, height: 44, background: GREEN, color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Check size={16} /> Опубликовать объявление
                  </button>
                </div>
              </>}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
