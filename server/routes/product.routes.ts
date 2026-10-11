import { Router } from 'express';
import type { ProductController } from '../controller/ProductController.js';

export function productRoutes(productController: ProductController) {
  const router = Router();
  router.get('/', productController.findAll);
  router.get('/:id', productController.findById);
  return router;
}
