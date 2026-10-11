import { Router } from 'express';
import { buildContainer } from '../config/container.js';
import { productRoutes } from './product.routes.js';

export function buildRoutes() {
  const container = buildContainer();
  const router = Router();

  router.use('/products', productRoutes(container.productController));

  return router;
}
