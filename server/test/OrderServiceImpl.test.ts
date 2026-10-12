import { beforeEach, describe, expect, it } from 'vitest';
import { OrderServiceImpl } from '../service/impl/OrderServiceImpl.js';
import { InMemoryOrderRepository } from '../repository/impl/memory/InMemoryOrderRepository.js';
import { InMemoryProductRepository } from '../repository/impl/memory/InMemoryProductRepository.js';
import { InMemoryUserRepository } from '../repository/impl/memory/InMemoryUserRepository.js';
import { ResourceNotFoundException } from '../exception/ResourceNotFoundException.js';
import { BusinessRuleException } from '../exception/BusinessRuleException.js';
import { CouponServiceImpl } from '../service/impl/CouponServiceImpl.js';

describe('OrderServiceImpl', () => {
  let orderService: OrderServiceImpl;
  let buyerId: number;

  beforeEach(async () => {
    const userRepository = new InMemoryUserRepository();
    const buyer = await userRepository.save({ name: 'João', email: 'joao@email.com', cpf: '52998224725', passwordHash: 'x' });
    buyerId = buyer.id;
    orderService = new OrderServiceImpl(new InMemoryOrderRepository(), new InMemoryProductRepository(), userRepository, new CouponServiceImpl());
  });

  it('aplica 5% de desconto no Pix', async () => {
    const createdOrder = await orderService.create({ userId: buyerId, productIds: [1, 2], paymentMethod: 'PIX' });
    expect(createdOrder.subtotal).toBe(118);
    expect(createdOrder.discount).toBe(5.9);
    expect(createdOrder.total).toBe(112.1);
  });

  it('soma cupom com desconto do Pix', async () => {
    const createdOrder = await orderService.create({
      userId: buyerId, productIds: [1], paymentMethod: 'PIX', couponCode: 'CS2MARKET10',
    });
    expect(createdOrder.discount).toBe(11.85);
  });

  it('não dá desconto no cartão sem cupom', async () => {
    const createdOrder = await orderService.create({ userId: buyerId, productIds: [1], paymentMethod: 'CARTAO' });
    expect(createdOrder.discount).toBe(0);
  });

  it('falha com produto inexistente', async () => {
    await expect(
      orderService.create({ userId: buyerId, productIds: [999], paymentMethod: 'PIX' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });

  it('limita reenvios de e-mail', async () => {
    const createdOrder = await orderService.create({ userId: buyerId, productIds: [1], paymentMethod: 'PIX' });
    for (let resendAttempt = 0; resendAttempt < 4; resendAttempt++) {
      await orderService.resendEmail(createdOrder.id);
    }
    await expect(orderService.resendEmail(createdOrder.id)).rejects.toBeInstanceOf(BusinessRuleException);
  });
});
