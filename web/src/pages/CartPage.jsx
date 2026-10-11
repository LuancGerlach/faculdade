import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';
import CheckoutStepper from '../components/CheckoutStepper';
import OrderSummary from '../components/OrderSummary';
import { ConfirmModal } from '../components/Modal';
import { EmptyState } from '../components/StateMessage';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { findCoupon } from '../api/orderApi';
import { getErrorMessage } from '../api/errorHandler';
import { formatCurrency, productTypeLabel } from '../utils/formatters';
import usePageTitle from '../hooks/usePageTitle';

export default function CartPage() {
  usePageTitle('Carrinho');
  const { cartItems, subtotal, removeFromCart, appliedCoupon, setAppliedCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [itemPendingRemoval, setItemPendingRemoval] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const confirmRemoval = () => {
    removeFromCart(itemPendingRemoval.id);
    toast.success(`${itemPendingRemoval.title} removido do carrinho`);
    setItemPendingRemoval(null);
  };

  const handleApplyCoupon = async (event) => {
    event.preventDefault();
    if (!couponCode.trim()) {
      setCouponError('Informe um código de cupom');
      return;
    }
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const response = await findCoupon(couponCode.trim());
      setAppliedCoupon(response.data);
      setCouponCode('');
      toast.success(`Cupom ${response.data.code} aplicado: ${response.data.discountPercent}% off`);
    } catch (requestError) {
      setCouponError(getErrorMessage(requestError, 'Cupom inválido'));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    navigate(isAuthenticated ? '/checkout' : '/login?redirect=/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page">
        <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: 'Carrinho' }]} />
        <h1 className="page-title">Seu carrinho</h1>
        <EmptyState title="Carrinho vazio" message="Explore o catálogo e adicione cursos, e-books ou pacotes.">
          <Link to="/catalogo" className="btn">Explorar catálogo</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: 'Carrinho' }]} />
      <CheckoutStepper currentStep={1} />
      <div className="split-layout">
        <section aria-labelledby="cart-title">
          <h1 id="cart-title" className="page-title">Seu carrinho ({cartItems.length})</h1>
          <ul>
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="cart-item">
                <div className="cart-thumb" aria-hidden="true">{productTypeLabel[cartItem.type]}</div>
                <div className="cart-info">
                  <p className="card-category">{productTypeLabel[cartItem.type]} · {cartItem.category}</p>
                  <h2><Link to={`/produto/${cartItem.id}`}>{cartItem.title}</Link></h2>
                  <button type="button" className="link-btn" onClick={() => setItemPendingRemoval(cartItem)}>
                    Remover<span className="visually-hidden"> {cartItem.title}</span>
                  </button>
                </div>
                <span className="price">{formatCurrency(cartItem.price)}</span>
              </li>
            ))}
          </ul>
          <Link to="/catalogo" className="btn btn-ghost" style={{ marginTop: 20 }}>Continuar comprando</Link>
        </section>

        <OrderSummary subtotal={subtotal} items={cartItems} paymentMethod="PIX" coupon={appliedCoupon}>
          {appliedCoupon ? (
            <div className="applied-coupon">
              <span>Cupom {appliedCoupon.code} aplicado</span>
              <button type="button" className="link-btn" onClick={() => setAppliedCoupon(null)}>Remover cupom</button>
            </div>
          ) : (
            <form className="coupon-form" onSubmit={handleApplyCoupon} noValidate>
              <label htmlFor="coupon" className="visually-hidden">Cupom de desconto</label>
              <input
                id="coupon"
                className="input"
                placeholder="Cupom de desconto"
                value={couponCode}
                aria-invalid={couponError ? 'true' : 'false'}
                aria-describedby={couponError ? 'coupon-error' : 'coupon-hint'}
                onChange={(event) => setCouponCode(event.target.value)}
              />
              <button type="submit" className="btn btn-blue btn-sm" disabled={isApplyingCoupon}>
                {isApplyingCoupon ? '...' : 'Aplicar'}
              </button>
            </form>
          )}
          {couponError && <p id="coupon-error" className="field-error" role="alert">{couponError}</p>}
          {!appliedCoupon && !couponError && <p id="coupon-hint" className="field-hint">Teste: CS2MARKET10</p>}
          <p className="field-hint">Desconto Pix aplicado como prévia; escolha o pagamento no próximo passo.</p>
          <button type="button" className="btn btn-full" style={{ marginTop: 14 }} onClick={handleCheckout}>
            Finalizar compra
          </button>
          <div className="info-note" style={{ marginTop: 14 }}><strong>Entrega imediata</strong> por e-mail após o pagamento.</div>
        </OrderSummary>
      </div>

      <ConfirmModal
        isOpen={Boolean(itemPendingRemoval)}
        title="Remover item?"
        description={itemPendingRemoval ? `“${itemPendingRemoval.title}” sairá do seu carrinho.` : ''}
        confirmLabel="Remover"
        isDanger
        onConfirm={confirmRemoval}
        onClose={() => setItemPendingRemoval(null)}
      />
    </div>
  );
}
