export type PaymentMethod = 'PIX' | 'CARTAO' | 'BOLETO';
export type OrderStatus = 'PAGO' | 'CANCELADO';

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
