import type { OrderStatus, PaymentMethod } from '../../entity/Order.js';

export interface OrderItemResponseDto {
  productId: number;
  title: string;
  type: string;
  category: string;
  unitPrice: number;
}

export interface OrderResponseDto {
  id: number;
  code: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  deliveryEmail: string;
  emailSentCount: number;
  lastEmailSentAt: string;
  createdAt: string;
  items: OrderItemResponseDto[];
}

export interface CouponResponseDto {
  code: string;
  discountPercent: number;
}
