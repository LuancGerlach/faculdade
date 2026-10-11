import type { Product, ProductType } from '../entity/Product.js';

export type ProductSort = 'mais-vendidos' | 'menor-preco' | 'maior-preco' | 'avaliacao';

export interface ProductFilter {
  search?: string;
  types?: ProductType[];
  maps?: string[];
  maxPriceInCents?: number;
  minRating?: number;
  sort?: ProductSort;
}

export interface ProductRepository {
  findAll(filter: ProductFilter): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByIds(ids: number[]): Promise<Product[]>;
}
