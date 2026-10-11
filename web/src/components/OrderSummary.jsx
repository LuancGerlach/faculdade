import { formatCurrency } from '../utils/formatters';

export const PIX_DISCOUNT_PERCENT = 5;

// Mesma regra do back (PricingUtils): Pix 5% + cupom, sobre o subtotal
export function calculateTotals(subtotal, paymentMethod, couponPercent = 0) {
  const pixPercent = paymentMethod === 'PIX' ? PIX_DISCOUNT_PERCENT : 0;
  const pixDiscount = Math.round(subtotal * pixPercent) / 100;
  const couponDiscount = Math.round(subtotal * couponPercent) / 100;
  return { pixDiscount, couponDiscount, total: subtotal - pixDiscount - couponDiscount };
}

export default function OrderSummary({ items, subtotal, paymentMethod, coupon, children }) {
  const { pixDiscount, couponDiscount, total } = calculateTotals(subtotal, paymentMethod, coupon?.discountPercent);

  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Resumo</h2>
      {items?.map((summaryItem) => (
        <div key={summaryItem.id} className="summary-row">
          <span>{summaryItem.title}</span><span>{formatCurrency(summaryItem.price)}</span>
        </div>
      ))}
      <div className="summary-row">
        <span>Subtotal ({items?.length ?? 0} {items?.length === 1 ? 'item' : 'itens'})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {pixDiscount > 0 && (
        <div className="summary-row discount"><span>Desconto Pix ({PIX_DISCOUNT_PERCENT}%)</span><span>− {formatCurrency(pixDiscount)}</span></div>
      )}
      {couponDiscount > 0 && (
        <div className="summary-row discount"><span>Cupom {coupon.code} ({coupon.discountPercent}%)</span><span>− {formatCurrency(couponDiscount)}</span></div>
      )}
      <div className="summary-row total"><span>Total</span><span>{formatCurrency(total)}</span></div>
      {children}
    </section>
  );
}
