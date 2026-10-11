import type { Request, Response } from 'express';
import type { ProductService } from '../service/ProductService.js';
import { productFilterSchema } from '../dto/product/ProductFilterDto.js';
import { parseIdParam } from './pathParams.js';

// Equivalente ao @RestController @RequestMapping("/api/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  findAll = async (request: Request, response: Response) => {
    const filter = productFilterSchema.parse(request.query);
    const products = await this.productService.findAll(filter);
    response.status(200).json(products);
  };

  findById = async (request: Request, response: Response) => {
    const productId = parseIdParam(request.params.id);
    const product = await this.productService.findById(productId);
    response.status(200).json(product);
  };
}
