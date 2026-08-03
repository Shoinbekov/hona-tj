'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchFavoriteListingIds, addFavorite, removeFavorite } from '@/lib/favorites';

interface FavoritesContextType {
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => Promise<'added' | 'removed' | 'auth-required' | 'error'>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) { setFavoriteIds(new Set()); return; }
    let cancelled = false;
    fetchFavoriteListingIds(user.id)
      .then(ids => { if (!cancelled) setFavoriteIds(ids); })
      .catch(err => console.error('[favorites] Не удалось загрузить избранное:', err));
    return () => { cancelled = true; };
  }, [user?.id]);

  const isFavorite = useCallback((listingId: string) => favoriteIds.has(listingId), [favoriteIds]);

  const toggleFavorite = useCallback(async (listingId: string) => {
    if (!user) return 'auth-required' as const;
    const wasFavorite = favoriteIds.has(listingId);

    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (wasFavorite) next.delete(listingId); else next.add(listingId);
      return next;
    });

    try {
      if (wasFavorite) await removeFavorite(user.id, listingId);
      else await addFavorite(user.id, listingId);
      return wasFavorite ? 'removed' as const : 'added' as const;
    } catch (err) {
      // Revert the optimistic update if the write failed.
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (wasFavorite) next.add(listingId); else next.delete(listingId);
        return next;
      });
      console.error('[favorites] Не удалось обновить избранное:', err);
      return 'error' as const;
    }
  }, [user, favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
