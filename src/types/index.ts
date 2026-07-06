export type Locale = 'tj' | 'ru' | 'en';
export type Currency = 'USD' | 'TJS';
export type ListingType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'garage' | 'room' | 'business' | 'industrial';

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
  rooms: string;
  rentPeriod: 'monthly' | 'daily';
  minPrice: string;
  maxPrice: string;
  currency: Currency;
  hasPhoto: boolean;
  fromOwner: boolean;
  newBuilding: boolean;
  furnished: boolean;
  pets: boolean;
  children: boolean;
  floorFrom: string;
  floorTo: string;
  notFirstFloor: boolean;
  notLastFloor: boolean;
  areaFrom: string;
  areaTo: string;
  landAreaFrom: string;
  landAreaTo: string;
  landType: string;
  utilities: string[];
  commercialTypes: string[];
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
}
