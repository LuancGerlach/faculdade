export type ProductType = 'CURSO' | 'EBOOK' | 'PACOTE';
export type ProductBadge = 'TOP' | 'NOVO';

export interface ProductLesson {
  title: string;
  duration: string;
}

export interface ProductModule {
  title: string;
  duration: string;
  lessons: ProductLesson[];
}

export interface Product {
  id: number;
  title: string;
  type: ProductType;
  category: string;
  map: string | null;
  priceInCents: number;
  oldPriceInCents: number | null;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  badge: ProductBadge | null;
  author: string;
  description: string;
  modules: ProductModule[];
  createdAt: Date;
}
