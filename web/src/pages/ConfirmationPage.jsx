import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CheckoutStepper from '../components/CheckoutStepper';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessage';
import { findOrderById } from '../api/orderApi';
import { getErrorMessage, getErrorStatus } from '../api/errorHandler';
import { formatCurrency, formatDate, paymentMethodLabel } from '../utils/formatters';
import usePageTitle from '../hooks/usePageTitle';

export default function ConfirmationPage() {
  usePageTitle('Compra confirmada');
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [requestError, setRequestError] = useState(null);

  const fetchOrder = useCallback(async () => {
    setRequestError(null);
    try {
      const response = await findOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      setRequestError({ message: getErrorMessage(error), status: getErrorStatus(error) });
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (requestError?.status === 404) {
    return (
      <div className="container page">
        <EmptyState title="Pedido não encontrado" message={requestError.message}>
          <Link to="/minha-conta" className="btn">Minhas compras</Link>
        </EmptyState>
      </div>
    );
  }
  if (requestError) return <div className="container page"><ErrorState message={requestError.message} onRetry={fetchOrder} /></div>;
  if (!order) return <div className="container page"><LoadingState label="Carregando pedido..." /></div>;

  return (
    <div className="container page">
      <CheckoutStepper currentStep={4} />
      <div className="confirm">
        <div className="confirm-icon" aria-hidden="true">✓</div>
        <h1 className="page-title">Compra confirmada!</h1>
        <p className="muted">Pedido <strong>#{order.code}</strong> · {formatDate(order.createdAt)} · {paymentMethodLabel[order.paymentMethod]}</p>
        <p className="email-note" style={{ textAlign: 'left' }}>
          Enviamos <strong>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</strong> para{' '}
          <strong>{order.deliveryEmail}</strong>. Verifique também o spam. Você acessa tudo em Minha conta › Compras.
        </p>
        <div className="order-box">
          <div className="order-box-head"><span>Itens do pedido</span><span>Total {formatCurrency(order.total)}</span></div>
          {order.items.map((orderItem) => (
            <div key={orderItem.productId} className="order-line"><span>{orderItem.title}</span><span>{formatCurrency(orderItem.unitPrice)}</span></div>
          ))}
          {order.discount > 0 && (
            <div className="order-line"><span>Descontos</span><span style={{ color: 'var(--success)' }}>− {formatCurrency(order.discount)}</span></div>
          )}
        </div>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link to="/minha-conta" className="btn">Ir para minhas compras</Link>
          <Link to="/catalogo" className="btn btn-ghost">Continuar comprando</Link>
        </div>
      </div>
    </div>
  );
}
