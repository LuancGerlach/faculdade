import { Router } from 'express';
import type { UserController } from '../controller/UserController.js';
import { validateBody } from '../middleware/validate.js';
import { createUserSchema, loginSchema, updateUserSchema } from '../dto/user/UserRequestDto.js';

export function userRoutes(userController: UserController) {
  const router = Router();
  router.post('/', validateBody(createUserSchema), userController.create);
  router.get('/:id', userController.findById);
  router.put('/:id', validateBody(updateUserSchema), userController.update);
  return router;
}

export function authRoutes(userController: UserController) {
  const router = Router();
  router.post('/login', validateBody(loginSchema), userController.login);
  return router;
}
