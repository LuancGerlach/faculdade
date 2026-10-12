import { Router } from 'express';
import type { OrderController } from '../controller/OrderController.js';
import { validateBody } from '../middleware/validate.js';
import { createOrderSchema } from '../dto/order/OrderRequestDto.js';

export function orderRoutes(orderController: OrderController) {
  const router = Router();
  router.post('/', validateBody(createOrderSchema), orderController.create);
  router.get('/:id', orderController.findById);
  router.patch('/:id/resend-email', orderController.resendEmail);
  router.delete('/:id', orderController.delete);
  return router;
}
