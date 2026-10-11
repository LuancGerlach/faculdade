import { isDatabaseConfigured } from './env.js';
import { createDatabaseConnection } from '../database/connection.js';
import type { ProductRepository } from '../repository/ProductRepository.js';
import { InMemoryProductRepository } from '../repository/impl/memory/InMemoryProductRepository.js';
import { PostgresProductRepository } from '../repository/impl/postgres/PostgresProductRepository.js';
import { ProductServiceImpl } from '../service/impl/ProductServiceImpl.js';
import { ProductController } from '../controller/ProductController.js';

// Equivalente ao contexto do Spring: monta os "beans" e injeta pelo construtor
function buildRepositories() {
  if (isDatabaseConfigured) {
    const database = createDatabaseConnection();
    return {
      productRepository: new PostgresProductRepository(database) as ProductRepository,
    };
  }

  return {
    productRepository: new InMemoryProductRepository() as ProductRepository,
  };
}

export function buildContainer() {
  const { productRepository } = buildRepositories();

  const productService = new ProductServiceImpl(productRepository);

  return {
    productController: new ProductController(productService),
  };
}

export type Container = ReturnType<typeof buildContainer>;
