import { createClient } from './supabase';

// Mock properties (seeded homepage placeholders) use plain numeric ids like "1", "2" —
// they don't exist in the `listings` table, so favoriting them would violate the
// favorites.listing_id foreign key. Only real, UUID-backed listings can be favorited.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isRealListingId(id: string): boolean {
  return UUID_RE.test(id);
}

export async function fetchFavoriteListingIds(userId: string): Promise<Set<string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId);

  if (error) throw error;
  return new Set(data.map(row => row.listing_id as string));
}

export async function addFavorite(userId: string, listingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, listing_id: listingId });

  // 23505 = unique_violation: the (user_id, listing_id) pair is already favorited
  // (e.g. a duplicate click before local state caught up) — already the desired state.
  if (error && error.code !== '23505') throw error;
}

export async function removeFavorite(userId: string, listingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId);

  if (error) throw error;
}
