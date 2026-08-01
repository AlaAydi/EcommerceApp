export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: 'electronics' | 'fashion' | 'home' | 'accessories' | 'beauty';
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specs?: { label: string; value: string }[];
  reviews?: ProductReview[];
}

export type CategoryType = 'all' | 'electronics' | 'fashion' | 'home' | 'accessories' | 'beauty';

export interface FilterOptions {
  category: CategoryType;
  maxPrice: number;
  minRating: number;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  searchQuery: string;
}
