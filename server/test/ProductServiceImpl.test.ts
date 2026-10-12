import { describe, expect, it } from 'vitest';
import { ProductServiceImpl } from '../service/impl/ProductServiceImpl.js';
import { CouponServiceImpl } from '../service/impl/CouponServiceImpl.js';
import { InMemoryProductRepository } from '../repository/impl/memory/InMemoryProductRepository.js';
import { ResourceNotFoundException } from '../exception/ResourceNotFoundException.js';

const productService = new ProductServiceImpl(new InMemoryProductRepository());

describe('ProductServiceImpl', () => {
  it('busca por texto no título, categoria e mapa', async () => {
    const foundProducts = await productService.findAll({ search: 'inferno' });
    expect(foundProducts.length).toBeGreaterThan(0);
    expect(foundProducts.every((product) => `${product.title} ${product.map}`.toLowerCase().includes('inferno'))).toBe(true);
  });

  it('combina filtros de tipo, mapa e preço máximo', async () => {
    const foundProducts = await productService.findAll({ type: ['CURSO'], map: ['Inferno'], maxPrice: 50 });
    expect(foundProducts.map((product) => product.title)).toEqual(['Controle de Banana', 'Duelos em apartamentos']);
  });

  it('ordena por menor preço', async () => {
    const foundProducts = await productService.findAll({ sort: 'menor-preco' });
    const prices = foundProducts.map((product) => product.price);
    expect(prices).toEqual([...prices].sort((first, second) => first - second));
  });

  it('detalha produto com quantidade de aulas', async () => {
    const foundProduct = await productService.findById(1);
    expect(foundProduct.lessonsCount).toBe(5);
  });

  it('lança 404 para produto inexistente', async () => {
    await expect(productService.findById(999)).rejects.toThrow(ResourceNotFoundException);
  });
});

describe('CouponServiceImpl', () => {
  const couponService = new CouponServiceImpl();

  it('encontra cupom ignorando maiúsculas', async () => {
    await expect(couponService.findByCode('cs2market10')).resolves.toEqual({ code: 'CS2MARKET10', discountPercent: 10 });
  });

  it('lança 404 para cupom inválido', async () => {
    await expect(couponService.findByCode('NADA')).rejects.toThrow(ResourceNotFoundException);
  });
});
