import type { Product } from '../../../entity/Product.js';
import type { ProductSort } from '../../ProductRepository.js';

export function sortProducts(products: Product[], sort: ProductSort = 'mais-vendidos'): Product[] {
  const sortedProducts = [...products];
  const comparatorBySort: Record<ProductSort, (first: Product, second: Product) => number> = {
    'mais-vendidos': (first, second) => second.salesCount - first.salesCount,
    'menor-preco': (first, second) => first.priceInCents - second.priceInCents,
    'maior-preco': (first, second) => second.priceInCents - first.priceInCents,
    avaliacao: (first, second) => second.rating - first.rating,
  };
  return sortedProducts.sort(comparatorBySort[sort]);
}
