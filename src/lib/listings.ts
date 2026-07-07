import { createClient } from './supabase';
import { ListingType, Property, PropertyType } from '@/types';

interface ListingPhotoRow {
  url: string;
  order: number;
}

interface ListingOwnerRow {
  full_name: string | null;
  phone: string | null;
}

interface ListingRow {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  listing_type: string;
  property_type: string;
  city: string;
  district: string | null;
  address: string | null;
  rooms: number | null;
  area: number | null;
  floor: number | null;
  total_floors: number | null;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  created_at: string;
  listing_photos: ListingPhotoRow[];
  profiles: ListingOwnerRow | null;
}

const LISTING_SELECT = '*, listing_photos(url, order), profiles(full_name, phone)';
const NEW_LISTING_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const localized = (s: string) => ({ tj: s, ru: s, en: s });

// The add-listing form only ever submits USD amounts today, so `price` is used as-is.
function rowToProperty(row: ListingRow): Property {
  const photos = [...row.listing_photos].sort((a, b) => a.order - b.order).map(p => p.url);
  const phone = row.profiles?.phone ?? '';

  return {
    id: row.id,
    title: localized(row.title),
    description: localized(row.description ?? ''),
    type: row.property_type as PropertyType,
    listingType: row.listing_type as ListingType,
    priceUSD: row.price,
    priceTJS: 0,
    rooms: row.rooms ?? 0,
    area: row.area ?? 0,
    floor: row.floor ?? undefined,
    totalFloors: row.total_floors ?? undefined,
    district: row.district ?? '',
    address: localized(row.address ?? ''),
    images: photos,
    features: [],
    whatsapp: phone,
    phone,
    agentName: row.profiles?.full_name ?? 'Пользователь',
    createdAt: row.created_at,
    views: 0,
    isNew: Date.now() - new Date(row.created_at).getTime() < NEW_LISTING_WINDOW_MS,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    city: row.city,
  };
}

export async function fetchActiveListings(): Promise<Property[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .order('order', { foreignTable: 'listing_photos', ascending: true })
    .returns<ListingRow[]>();

  if (error) throw error;
  return data.map(rowToProperty);
}

export interface UserListing extends Property {
  isActive: boolean;
}

// All of this user's own listings, active or hidden — used by the dashboard, which
// (unlike the public homepage) needs to show the owner their inactive listings too.
export async function fetchListingsByUser(userId: string): Promise<UserListing[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('order', { foreignTable: 'listing_photos', ascending: true })
    .returns<ListingRow[]>();

  if (error) throw error;
  return data.map(row => ({ ...rowToProperty(row), isActive: row.is_active }));
}

export async function fetchListingById(id: string): Promise<Property | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProperty(data as unknown as ListingRow);
}

export interface NewListingInput {
  userId: string;
  title: string;
  description: string;
  price: number;
  listingType: 'sale' | 'rent';
  propertyType: 'apartment' | 'house' | 'commercial' | 'land' | 'garage';
  city: string;
  district: string;
  address: string;
  rooms: number | null;
  area: number | null;
  floor: number | null;
  totalFloors: number | null;
  photos: File[];
}

export async function createListing(input: NewListingInput): Promise<string> {
  const supabase = createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      user_id: input.userId,
      title: input.title,
      description: input.description,
      price: input.price,
      currency: 'USD',
      listing_type: input.listingType,
      property_type: input.propertyType,
      city: input.city,
      district: input.district,
      address: input.address,
      rooms: input.rooms,
      area: input.area,
      floor: input.floor,
      total_floors: input.totalFloors,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[createListing] insert into listings failed:', error);
    throw error;
  }
  const listingId = listing.id as string;

  if (input.photos.length > 0) {
    const photoRows = await Promise.all(input.photos.map(async (file, i) => {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${input.userId}/${listingId}/${i}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('listing-photos').upload(path, file);
      if (uploadError) {
        console.error('[createListing] photo upload failed:', uploadError, { path });
        throw uploadError;
      }
      const { data: pub } = supabase.storage.from('listing-photos').getPublicUrl(path);
      return { listing_id: listingId, url: pub.publicUrl, order: i };
    }));

    const { error: photosError } = await supabase.from('listing_photos').insert(photoRows);
    if (photosError) {
      console.error('[createListing] insert into listing_photos failed:', photosError);
      throw photosError;
    }
  }

  return listingId;
}
