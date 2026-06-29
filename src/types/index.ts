export type Locale = 'tj' | 'ru' | 'en';
export type Currency = 'USD' | 'TJS';
export type ListingType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land';

export interface Property {
  id: string;
  title: { tj: string; ru: string; en: string };
  description: { tj: string; ru: string; en: string };
  type: PropertyType;
  listingType: ListingType;
  priceUSD: number;
  priceTJS: number;
  rooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  district: string;
  address: { tj: string; ru: string; en: string };
  images: string[];
  features: string[];
  whatsapp: string;
  phone: string;
  agentName: string;
  agentAvatar?: string;
  createdAt: string;
  views: number;
  isFeatured?: boolean;
  isTop?: boolean;
  isNew?: boolean;
}

export interface SearchFilters {
  query: string;
  listingType: ListingType | 'all';
  propertyType: PropertyType | 'all';
  district: string;
  minPrice: string;
  maxPrice: string;
  rooms: string;
  currency: Currency;
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
}
