import { isDatabaseConfigured } from './env.js';
import { createDatabaseConnection } from '../database/connection.js';
import type { ProductRepository } from '../repository/ProductRepository.js';
import type { UserRepository } from '../repository/UserRepository.js';
import { InMemoryUserRepository } from '../repository/impl/memory/InMemoryUserRepository.js';
import { PostgresUserRepository } from '../repository/impl/postgres/PostgresUserRepository.js';
import { InMemoryProductRepository } from '../repository/impl/memory/InMemoryProductRepository.js';
import { PostgresProductRepository } from '../repository/impl/postgres/PostgresProductRepository.js';
import { ProductServiceImpl } from '../service/impl/ProductServiceImpl.js';
import { ProductController } from '../controller/ProductController.js';
import { UserServiceImpl } from '../service/impl/UserServiceImpl.js';
import { UserController } from '../controller/UserController.js';

// Equivalente ao contexto do Spring: monta os "beans" e injeta pelo construtor
function buildRepositories() {
  if (isDatabaseConfigured) {
    const database = createDatabaseConnection();
    return {
      productRepository: new PostgresProductRepository(database) as ProductRepository,
      userRepository: new PostgresUserRepository(database) as UserRepository,
    };
  }

  return {
    productRepository: new InMemoryProductRepository() as ProductRepository,
    userRepository: new InMemoryUserRepository() as UserRepository,
  };
}

export function buildContainer() {
  const { productRepository, userRepository } = buildRepositories();

  const productService = new ProductServiceImpl(productRepository);
  const userService = new UserServiceImpl(userRepository);

  return {
    productController: new ProductController(productService),
    userController: new UserController(userService),
  };
}

export type Container = ReturnType<typeof buildContainer>;
