import { Router } from 'express';
import { buildContainer } from '../config/container.js';
import { productRoutes } from './product.routes.js';
import { authRoutes, userRoutes } from './user.routes.js';

export function buildRoutes() {
  const container = buildContainer();
  const router = Router();

  router.use('/products', productRoutes(container.productController));
  router.use('/users', userRoutes(container.userController));
  router.use('/auth', authRoutes(container.userController));

  return router;
}
