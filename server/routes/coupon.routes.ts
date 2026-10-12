import { Router } from 'express';
import type { CouponController } from '../controller/CouponController.js';

export function couponRoutes(couponController: CouponController) {
  const router = Router();
  router.get('/:code', couponController.findByCode);
  return router;
}
