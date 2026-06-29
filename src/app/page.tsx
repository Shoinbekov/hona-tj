'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import SearchSection from '@/components/SearchFilters';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PROPERTIES } from '@/lib/data';
import { SearchFilters } from '@/types';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';

const PER_PAGE = 6;
const BLUE = '#1a56db';

const EMPTY: SearchFilters = {
  query: '', listingType: 'all', propertyType: 'all',
  district: '', minPrice: '', maxPrice: '', rooms: '', currency: 'USD',
};

export default function HomePage() {
  const { currency } = useLanguage();
  const [filters, setFilters] = useState<SearchFilters>(EMPTY);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    setPage(1);
    return MOCK_PROPERTIES.filter(p => {
      if (filters.listingType !== 'all' && p.listingType !== filters.listingType) return false;
      if (filters.propertyType !== 'all' && p.type !== filters.propertyType) return false;
      if (filters.district && p.district !== filters.district) return false;
      if (filters.rooms && p.rooms < +filters.rooms) return false;
      const price = currency === 'USD' ? p.priceUSD : p.priceTJS;
      if (filters.minPrice && price < +filters.minPrice) return false;
      if (filters.maxPrice && price > +filters.maxPrice) return false;
      return true;
    });
  }, [filters, currency]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const goTo = (n: number) => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />

      {/* Push content below fixed navbar */}
      <div style={{ paddingTop: 60 }}>
        <SearchSection filters={filters} onChange={setFilters} resultCount={filtered.length} />
      </div>

      {/* Listings */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px 48px' }}>
        {paginated.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="cards-grid">
              {paginated.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 36 }}>
                <button
                  onClick={() => goTo(page - 1)} disabled={page === 1}
                  style={{ width: 36, height: 36, border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={16} color="#6b7280" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
                  if (n !== 1 && n !== totalPages && Math.abs(n - page) > 1) {
                    return Math.abs(n - page) === 2 ? <span key={n} style={{ padding: '0 4px', color: '#9ca3af' }}>…</span> : null;
                  }
                  return (
                    <button key={n} onClick={() => goTo(n)}
                      style={{ width: 36, height: 36, border: n === page ? 'none' : '1px solid #d1d5db', borderRadius: 6, background: n === page ? BLUE : '#fff', color: n === page ? '#fff' : '#374151', fontWeight: n === page ? 700 : 400, fontSize: 14, cursor: 'pointer' }}>
                      {n}
                    </button>
                  );
                })}

                <button
                  onClick={() => goTo(page + 1)} disabled={page === totalPages}
                  style={{ width: 36, height: 36, border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
                  <ChevronRight size={16} color="#6b7280" />
                </button>
              </div>
            )}

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
              Показано {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} из {filtered.length}
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Home size={28} color={BLUE} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Ничего не найдено</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Попробуйте изменить параметры поиска</p>
            <button onClick={() => setFilters(EMPTY)}
              style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Сбросить фильтры
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 900px) { .cards-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
