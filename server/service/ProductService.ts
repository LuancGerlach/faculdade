import type { ProductFilterDto } from '../dto/product/ProductFilterDto.js';
import type { ProductDetailDto, ProductSummaryDto } from '../dto/product/ProductResponseDto.js';

export interface ProductService {
  findAll(filter: ProductFilterDto): Promise<ProductSummaryDto[]>;
  findById(id: number): Promise<ProductDetailDto>;
}
