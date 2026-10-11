import type { Product } from '../../../entity/Product.js';
import type { ProductFilter, ProductRepository } from '../../ProductRepository.js';
import { productsSeed } from '../../../database/seed/products.seed.js';
import { sortProducts } from './productSorting.js';

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = productsSeed.map((productSeed, index) => ({
    ...productSeed,
    id: index + 1,
    createdAt: new Date(Date.now() - index * 86_400_000),
  }));

  async findAll(filter: ProductFilter): Promise<Product[]> {
    const normalizedSearch = filter.search?.trim().toLowerCase();

    const filteredProducts = this.products.filter((product) => {
      if (normalizedSearch) {
        const searchableText = `${product.title} ${product.category} ${product.map ?? ''} ${product.description}`.toLowerCase();
        if (!searchableText.includes(normalizedSearch)) return false;
      }
      if (filter.types?.length && !filter.types.includes(product.type)) return false;
      if (filter.maps?.length && (!product.map || !filter.maps.includes(product.map))) return false;
      if (filter.maxPriceInCents !== undefined && product.priceInCents > filter.maxPriceInCents) return false;
      if (filter.minRating !== undefined && product.rating < filter.minRating) return false;
      return true;
    });

    return sortProducts(filteredProducts, filter.sort);
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.products.filter((product) => ids.includes(product.id));
  }
}
