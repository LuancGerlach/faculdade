import { Router } from 'express';
import { buildContainer, type Container } from '../config/container.js';
import { productRoutes } from './product.routes.js';
import { authRoutes, userRoutes } from './user.routes.js';
import { orderRoutes } from './order.routes.js';
import { couponRoutes } from './coupon.routes.js';

export function buildRoutes(container: Container = buildContainer()) {
  const router = Router();

  router.use('/products', productRoutes(container.productController));
  router.use('/users', userRoutes(container.userController));
  router.get('/users/:id/orders', container.orderController.findByUserId);
  router.use('/auth', authRoutes(container.userController));
  router.use('/orders', orderRoutes(container.orderController));
  router.use('/coupons', couponRoutes(container.couponController));

  return router;
}
