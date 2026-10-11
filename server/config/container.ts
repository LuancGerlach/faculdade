import { isDatabaseConfigured } from './env.js';
import { createDatabaseConnection } from '../database/connection.js';
import type { ProductRepository } from '../repository/ProductRepository.js';
import type { UserRepository } from '../repository/UserRepository.js';
import type { OrderRepository } from '../repository/OrderRepository.js';
import { InMemoryProductRepository } from '../repository/impl/memory/InMemoryProductRepository.js';
import { InMemoryUserRepository } from '../repository/impl/memory/InMemoryUserRepository.js';
import { InMemoryOrderRepository } from '../repository/impl/memory/InMemoryOrderRepository.js';
import { PostgresProductRepository } from '../repository/impl/postgres/PostgresProductRepository.js';
import { PostgresUserRepository } from '../repository/impl/postgres/PostgresUserRepository.js';
import { PostgresOrderRepository } from '../repository/impl/postgres/PostgresOrderRepository.js';
import { ProductServiceImpl } from '../service/impl/ProductServiceImpl.js';
import { UserServiceImpl } from '../service/impl/UserServiceImpl.js';
import { OrderServiceImpl } from '../service/impl/OrderServiceImpl.js';
import { ProductController } from '../controller/ProductController.js';
import { UserController } from '../controller/UserController.js';
import { OrderController } from '../controller/OrderController.js';

interface Repositories {
  productRepository: ProductRepository;
  userRepository: UserRepository;
  orderRepository: OrderRepository;
}

// Equivalente a um @Profile: Postgres quando há DATABASE_URL, memória caso contrário
function buildRepositories(): Repositories {
  if (isDatabaseConfigured) {
    const database = createDatabaseConnection();
    return {
      productRepository: new PostgresProductRepository(database),
      userRepository: new PostgresUserRepository(database),
      orderRepository: new PostgresOrderRepository(database),
    };
  }

  return {
    productRepository: new InMemoryProductRepository(),
    userRepository: new InMemoryUserRepository(),
    orderRepository: new InMemoryOrderRepository(),
  };
}

// Equivalente ao contexto do Spring: monta os "beans" e injeta pelo construtor
export function buildContainer(repositories: Repositories = buildRepositories()) {
  const { productRepository, userRepository, orderRepository } = repositories;

  const productService = new ProductServiceImpl(productRepository);
  const userService = new UserServiceImpl(userRepository);
  const orderService = new OrderServiceImpl(orderRepository, productRepository, userRepository);

  return {
    productController: new ProductController(productService),
    userController: new UserController(userService),
    orderController: new OrderController(orderService),
  };
}

export type Container = ReturnType<typeof buildContainer>;
