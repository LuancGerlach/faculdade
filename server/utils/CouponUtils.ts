// Cupons fixos: retorno mockado, sem tabela no banco
const couponDiscountPercentByCode: Record<string, number> = {
  CS2MARKET10: 10,
  HEADSHOT15: 15,
};

export function findCouponDiscountPercent(couponCode: string): number | undefined {
  return couponDiscountPercentByCode[couponCode.trim().toUpperCase()];
}
