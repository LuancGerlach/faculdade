import type { Product } from '../entity/Product.js';
import type { ProductDetailDto, ProductSummaryDto } from '../dto/product/ProductResponseDto.js';
import { centsToReais } from './MoneyMapper.js';

// Equivalente ao @Mapper do MapStruct
export const ProductMapper = {
  toSummaryDto(product: Product): ProductSummaryDto {
    return {
      id: product.id,
      title: product.title,
      type: product.type,
      category: product.category,
      map: product.map,
      price: centsToReais(product.priceInCents),
      oldPrice: product.oldPriceInCents === null ? null : centsToReais(product.oldPriceInCents),
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      badge: product.badge,
    };
  },

  toDetailDto(product: Product): ProductDetailDto {
    const lessonsCount = product.modules.reduce((total, productModule) => total + productModule.lessons.length, 0);
    return {
      ...ProductMapper.toSummaryDto(product),
      author: product.author,
      description: product.description,
      lessonsCount,
      modules: product.modules,
    };
  },
};
