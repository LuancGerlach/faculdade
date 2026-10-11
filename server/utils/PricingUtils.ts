import type { PaymentMethod } from '../entity/Order.js';

// Regras de preço centralizadas (cupons fixos: retorno mockado, sem tabela)
export const PIX_DISCOUNT_PERCENT = 5;

const couponDiscountPercentByCode: Record<string, number> = {
  CS2MARKET10: 10,
  HEADSHOT15: 15,
};

export function findCouponDiscountPercent(couponCode: string): number | undefined {
  return couponDiscountPercentByCode[couponCode.trim().toUpperCase()];
}

export function calculateDiscountInCents(subtotalInCents: number, paymentMethod: PaymentMethod, couponPercent = 0) {
  const pixPercent = paymentMethod === 'PIX' ? PIX_DISCOUNT_PERCENT : 0;
  return Math.round((subtotalInCents * (pixPercent + couponPercent)) / 100);
}

export function generateOrderCode(): string {
  const randomDigits = Math.floor(10_000 + Math.random() * 90_000);
  return `CS2-${randomDigits}`;
}
