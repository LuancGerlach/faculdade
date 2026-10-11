import type { ProductBadge, ProductModule, ProductType } from '../../entity/Product.js';

export interface ProductSummaryDto {
  id: number;
  title: string;
  type: ProductType;
  category: string;
  map: string | null;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviewsCount: number;
  badge: ProductBadge | null;
}

export interface ProductDetailDto extends ProductSummaryDto {
  author: string;
  description: string;
  lessonsCount: number;
  modules: ProductModule[];
}
