export type { PaymentMethod } from '../../shared/pricing.js';
import type { PaymentMethod } from '../../shared/pricing.js';
export type OrderStatus = 'PAGO';

export interface OrderItem {
  productId: number;
  title: string;
  type: string;
  category: string;
  unitPriceInCents: number;
}

export interface Order {
  id: number;
  code: string;
  userId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotalInCents: number;
  discountInCents: number;
  totalInCents: number;
  items: OrderItem[];
  emailSentCount: number;
  lastEmailSentAt: Date;
  createdAt: Date;
}
