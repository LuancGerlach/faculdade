import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from '../components/Toast';
import CheckoutStepper from '../components/CheckoutStepper';
import OrderSummary, { calculateTotals } from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orderApi';
import { getErrorMessage } from '../api/errorHandler';
import { formatCurrency, paymentMethodLabel } from '../utils/formatters';
import usePageTitle from '../hooks/usePageTitle';

const paymentDescriptions = {
  PIX: 'Pagamento via Pix com 5% de desconto. O QR Code é gerado ao confirmar o pedido.',
  CARTAO: 'Pagamento no cartão de crédito (simulado neste projeto).',
  BOLETO: 'Boleto bancário (simulado). A confirmação seria em até 2 dias úteis.',
};

export default function CheckoutPage() {
  usePageTitle('Checkout');
  const { cartItems, subtotal, appliedCoupon, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [completedOrderId, setCompletedOrderId] = useState(null);

  // Pedido criado: o carrinho esvazia, então redireciona antes da checagem de carrinho vazio
  if (completedOrderId) return <Navigate to={`/pedido/${completedOrderId}`} replace />;
  if (!isAuthenticated) return <Navigate to="/login?redirect=/checkout" replace />;
  if (cartItems.length === 0) return <Navigate to="/carrinho" replace />;

  const { total } = calculateTotals(subtotal, paymentMethod, appliedCoupon?.discountPercent);

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const createdOrder = await createOrder({
        userId: currentUser.id,
        productIds: cartItems.map((cartItem) => cartItem.id),
        paymentMethod,
        couponCode: appliedCoupon?.code,
      });
      setCompletedOrderId(createdOrder.id);
      clearCart();
      toast.success('Pagamento confirmado!');
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError, 'Não foi possível finalizar o pedido.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page">
      <CheckoutStepper currentStep={2} />
      <div className="split-layout">
        <section aria-labelledby="checkout-title">
          <h1 id="checkout-title" className="page-title">Pagamento</h1>

          <h2 className="section-title">Dados de entrega</h2>
          <div className="account-box">
            <div>
              <p className="label">E-mail da conta · recebe as compras</p>
              <p className="value">{currentUser.email}</p>
              <p className="muted" style={{ fontSize: 14 }}>{currentUser.name} · CPF {currentUser.cpf}</p>
            </div>
            <Link to="/minha-conta?aba=dados" className="btn btn-ghost btn-sm">Alterar dados</Link>
          </div>

          <h2 className="section-title">Forma de pagamento</h2>
          <fieldset className="payment-options">
            <legend className="visually-hidden">Forma de pagamento</legend>
            {Object.keys(paymentMethodLabel).map((methodKey) => (
              <div key={methodKey} className="payment-option">
                <input
                  type="radio"
                  id={`payment-${methodKey}`}
                  name="paymentMethod"
                  value={methodKey}
                  checked={paymentMethod === methodKey}
                  onChange={() => setPaymentMethod(methodKey)}
                  aria-describedby="payment-description"
                />
                <label htmlFor={`payment-${methodKey}`}>
                  {paymentMethodLabel[methodKey]}{methodKey === 'PIX' && ' (−5%)'}
                </label>
              </div>
            ))}
          </fieldset>
          <p id="payment-description" className="info-note" aria-live="polite">{paymentDescriptions[paymentMethod]}</p>
        </section>

        <OrderSummary items={cartItems} subtotal={subtotal} paymentMethod={paymentMethod} coupon={appliedCoupon}>
          {submitError && <div className="form-alert" role="alert" style={{ marginTop: 14 }}>{submitError}</div>}
          <button type="button" className="btn btn-full" style={{ marginTop: 14 }} onClick={handleConfirmOrder} disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : `Pagar ${formatCurrency(total)}`}
          </button>
          <p className="email-note">Assim que o pagamento for confirmado, tudo é enviado para <strong>{currentUser.email}</strong>.</p>
        </OrderSummary>
      </div>
    </div>
  );
}
