'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchSection from '@/components/SearchFilters';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PROPERTIES, getPriceInCurrency } from '@/lib/data';
import { fetchActiveListings } from '@/lib/listings';
import { Property } from '@/types';
import { FilterState, emptyFilterState } from '@/lib/filterConfig';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';

const PER_PAGE = 6;
const MIN_LISTINGS = 3;
const BLUE = '#1a56db';

function matchesRoomsSelection(sel: string[], rooms: number): boolean {
  if (sel.length === 0) return true;
  return sel.some(v => v.endsWith('+') ? rooms >= parseInt(v, 10) : rooms === Number(v));
}

function matchesQuery(p: Property, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [p.title.ru, p.title.tj, p.title.en, p.description.ru, p.description.tj, p.description.en]
    .join(' ').toLowerCase();
  return haystack.includes(q);
}

export default function HomePage() {
  const { currency, rates } = useLanguage();
  const [filters, setFilters] = useState<FilterState>(emptyFilterState);
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Top up with the seeded mock listings while the database is still sparse, so the
    // homepage never looks empty/broken before enough real listings have been posted.
    fetchActiveListings()
      .then(data => { if (!cancelled) setListings(data.length < MIN_LISTINGS ? [...data, ...MOCK_PROPERTIES] : data); })
      .catch(() => { if (!cancelled) setListings(MOCK_PROPERTIES); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    setPage(1);
    // "Возьму в аренду" describes people looking to rent something in — it isn't a kind
    // of listing this database stores, so that tab always shows zero results.
    if (filters.category === 'rent_wanted') return [];

    return listings.filter(p => {
      if (p.listingType !== filters.mode) return false;
      if (p.type !== filters.category) return false;
      if (filters.city && filters.city !== 'tj' && p.city !== filters.city) return false;
      if (filters.district && p.district !== filters.district) return false;

      const rooms = filters.values.rooms as string[] | undefined;
      if (rooms && !matchesRoomsSelection(rooms, p.rooms)) return false;

      let price = getPriceInCurrency(p, currency, rates);
      if (filters.priceUnit === 'sqm' && p.area) price = price / p.area;
      if (filters.priceUnit === 'sotka' && p.area) price = price / (p.area / 100);
      if (filters.minPrice && price < +filters.minPrice) return false;
      if (filters.maxPrice && price > +filters.maxPrice) return false;

      if (filters.values.hasPhoto && p.images.length === 0) return false;

      const furnished = filters.values.furnished as string[] | undefined;
      if (furnished?.length && !p.features.some(f => f.toLowerCase().includes('мебел'))) return false;

      if (filters.values.notFirstFloor && p.floor === 1) return false;
      if (filters.values.notLastFloor && p.floor !== undefined && p.totalFloors !== undefined && p.floor === p.totalFloors) return false;

      const floorFrom = filters.values.floorFrom as string | undefined;
      const floorTo   = filters.values.floorTo as string | undefined;
      if (floorFrom && p.floor !== undefined && p.floor < +floorFrom) return false;
      if (floorTo   && p.floor !== undefined && p.floor > +floorTo)   return false;

      const areaFrom = filters.values.areaFrom as string | undefined;
      const areaTo   = filters.values.areaTo as string | undefined;
      if (areaFrom && p.area < +areaFrom) return false;
      if (areaTo   && p.area > +areaTo)   return false;

      const landAreaFrom = filters.values.landAreaFrom as string | undefined;
      const landAreaTo   = filters.values.landAreaTo as string | undefined;
      if (landAreaFrom && p.area / 100 < +landAreaFrom) return false;
      if (landAreaTo   && p.area / 100 > +landAreaTo)   return false;

      if (!matchesQuery(p, filters.query)) return false;

      return true;
    });
  }, [listings, filters, currency, rates]);

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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af', fontSize: 14 }}>
            Загрузка объявлений…
          </div>
        ) : paginated.length > 0 ? (
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
            <button onClick={() => setFilters(emptyFilterState())}
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
