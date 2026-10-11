import type { Order } from '../entity/Order.js';
import type { OrderResponseDto } from '../dto/order/OrderResponseDto.js';
import { centsToReais } from './MoneyMapper.js';

export const OrderMapper = {
  toDto(order: Order, deliveryEmail: string): OrderResponseDto {
    return {
      id: order.id,
      code: order.code,
      status: order.status,
      paymentMethod: order.paymentMethod,
      subtotal: centsToReais(order.subtotalInCents),
      discount: centsToReais(order.discountInCents),
      total: centsToReais(order.totalInCents),
      deliveryEmail,
      emailSentCount: order.emailSentCount,
      lastEmailSentAt: new Date(order.lastEmailSentAt).toISOString(),
      createdAt: new Date(order.createdAt).toISOString(),
      items: order.items.map((orderItem) => ({
        productId: orderItem.productId,
        title: orderItem.title,
        type: orderItem.type,
        category: orderItem.category,
        unitPrice: centsToReais(orderItem.unitPriceInCents),
      })),
    };
  },
};
