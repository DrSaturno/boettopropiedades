export interface PropertyData {
  id: number;
  title: string;
  slug: string;
  operation: string;
  propertyType: string;
  status: string;
  featured: boolean;
  price: number | null;
  currency: string;
  expenses: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  province: string;
  description: string | null;
  totalArea: number | null;
  coveredArea: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  age: number | null;
  amenities: string[];
  images: string[];
  videoUrl: string | null;
  externalUrl: string | null;
  externalSource: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryData {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  message: string | null;
  type: string;
  propertyId: number | null;
  read: boolean;
  createdAt: string;
}

export interface PropertyFilters {
  operation?: string;
  propertyType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  rooms?: number;
  minArea?: number;
  featured?: boolean;
}

export interface ScrapedProperty {
  title: string;
  price: number | null;
  currency: string;
  operation: string;
  propertyType: string;
  address: string;
  neighborhood: string;
  city: string;
  province: string;
  description: string;
  totalArea: number | null;
  coveredArea: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  age: number | null;
  amenities: string[];
  images: string[];
  externalUrl: string;
  externalSource: string;
}
