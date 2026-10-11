import { and, asc, desc, eq, gte, ilike, inArray, lte, or, type SQL } from 'drizzle-orm';
import type { Database } from '../../../database/connection.js';
import { products } from '../../../database/schema.js';
import type { Product } from '../../../entity/Product.js';
import type { ProductFilter, ProductRepository, ProductSort } from '../../ProductRepository.js';

const orderBySort: Record<ProductSort, SQL> = {
  'mais-vendidos': desc(products.salesCount),
  'menor-preco': asc(products.priceInCents),
  'maior-preco': desc(products.priceInCents),
  avaliacao: desc(products.rating),
};

export class PostgresProductRepository implements ProductRepository {
  constructor(private readonly database: Database) {}

  async findAll(filter: ProductFilter): Promise<Product[]> {
    const conditions: (SQL | undefined)[] = [];

    if (filter.search?.trim()) {
      const searchPattern = `%${filter.search.trim()}%`;
      conditions.push(
        or(
          ilike(products.title, searchPattern),
          ilike(products.category, searchPattern),
          ilike(products.map, searchPattern),
          ilike(products.description, searchPattern),
        ),
      );
    }
    if (filter.types?.length) conditions.push(inArray(products.type, filter.types));
    if (filter.maps?.length) conditions.push(inArray(products.map, filter.maps));
    if (filter.maxPriceInCents !== undefined) conditions.push(lte(products.priceInCents, filter.maxPriceInCents));
    if (filter.minRating !== undefined) conditions.push(gte(products.rating, filter.minRating));

    const productRows = await this.database
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBySort[filter.sort ?? 'mais-vendidos']);

    return productRows as Product[];
  }

  async findById(id: number): Promise<Product | null> {
    const [productRow] = await this.database.select().from(products).where(eq(products.id, id));
    return (productRow as Product) ?? null;
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    if (!ids.length) return [];
    const productRows = await this.database.select().from(products).where(inArray(products.id, ids));
    return productRows as Product[];
  }
}
