// Regra única de desconto, usada pelo back (pedido) e pelo front (resumo do carrinho)
export type PaymentMethod = 'PIX' | 'CARTAO' | 'BOLETO';

export const PIX_DISCOUNT_PERCENT = 5;

export function calculateDiscountInCents(subtotalInCents: number, paymentMethod: PaymentMethod, couponPercent = 0) {
  const pixPercent = paymentMethod === 'PIX' ? PIX_DISCOUNT_PERCENT : 0;
  return Math.round((subtotalInCents * (pixPercent + couponPercent)) / 100);
}
