import type { ProductService } from '../ProductService.js';
import type { ProductRepository } from '../../repository/ProductRepository.js';
import type { ProductFilterDto } from '../../dto/product/ProductFilterDto.js';
import type { ProductDetailDto, ProductSummaryDto } from '../../dto/product/ProductResponseDto.js';
import type { ProductType } from '../../entity/Product.js';
import { ProductMapper } from '../../mapper/ProductMapper.js';
import { reaisToCents } from '../../mapper/MoneyMapper.js';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException.js';

export class ProductServiceImpl implements ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(filter: ProductFilterDto): Promise<ProductSummaryDto[]> {
    const products = await this.productRepository.findAll({
      search: filter.search,
      types: filter.type as ProductType[] | undefined,
      maps: filter.map,
      maxPriceInCents: filter.maxPrice === undefined ? undefined : reaisToCents(filter.maxPrice),
      minRating: filter.minRating,
      sort: filter.sort,
    });

    return products.map(ProductMapper.toSummaryDto);
  }

  async findById(id: number): Promise<ProductDetailDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ResourceNotFoundException(`Produto ${id} não encontrado`);
    }
    return ProductMapper.toDetailDto(product);
  }
}
