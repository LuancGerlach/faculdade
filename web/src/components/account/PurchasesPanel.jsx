import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../Modal';
import { EmptyState, ErrorState, LoadingState } from '../StateMessage';
import { useOrders } from '../../hooks/useOrders';
import { deleteOrder, resendOrderEmail } from '../../api/orderApi';
import { getErrorMessage } from '../../api/errorHandler';
import { formatCurrency, formatDate, paymentMethodLabel } from '../../utils/formatters';

export default function PurchasesPanel({ userId, onUserNotFound }) {
  const { orders, isLoading, error, refetch, replaceOrder, removeOrder } = useOrders(userId);
  const [resendingOrderId, setResendingOrderId] = useState(null);
  const [orderPendingDeletion, setOrderPendingDeletion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUserMissing = error?.status === 404;
  useEffect(() => {
    if (isUserMissing) onUserNotFound();
  }, [isUserMissing, onUserNotFound]);

  if (isUserMissing) return null;

  const handleResendEmail = async (order) => {
    setResendingOrderId(order.id);
    try {
      const response = await resendOrderEmail(order.id);
      replaceOrder(response.data);
      toast.success(`E-mail do pedido #${order.code} reenviado para ${response.data.deliveryEmail}`);
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setResendingOrderId(null);
    }
  };

  const handleConfirmDeletion = async () => {
    setIsDeleting(true);
    try {
      await deleteOrder(orderPendingDeletion.id);
      removeOrder(orderPendingDeletion.id);
      toast.success(`Pedido #${orderPendingDeletion.code} cancelado`);
      setOrderPendingDeletion(null);
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h2 className="page-title">Minhas compras</h2>
      <p className="muted" style={{ marginBottom: 20 }}>Precisou de novo? Reenvie o acesso para o seu e-mail.</p>

      {error && <ErrorState message={error.message} onRetry={refetch} />}
      {!error && isLoading && <LoadingState label="Carregando compras..." />}
      {!error && !isLoading && orders.length === 0 && (
        <EmptyState title="Nenhuma compra ainda" message="Seus pedidos aparecem aqui depois do pagamento.">
          <Link to="/catalogo" className="btn">Explorar catálogo</Link>
        </EmptyState>
      )}
      {!error && !isLoading && orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="purchase">
              <div className="purchase-info">
                <p className="card-category">Pedido #{order.code} · {paymentMethodLabel[order.paymentMethod]}</p>
                <h3>{order.items.map((orderItem) => orderItem.title).join(', ')}</h3>
                <p className="purchase-meta">
                  {formatDate(order.createdAt)} · {formatCurrency(order.total)} · <span className="status">Enviado</span>
                  {' '}· {order.emailSentCount} {order.emailSentCount === 1 ? 'envio' : 'envios'}
                </p>
              </div>
              <div className="purchase-actions">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handleResendEmail(order)}
                  disabled={resendingOrderId === order.id}
                  aria-label={`Reenviar e-mail do pedido ${order.code}`}
                >
                  {resendingOrderId === order.id ? 'Enviando...' : 'Reenviar e-mail'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setOrderPendingDeletion(order)}
                  aria-label={`Cancelar pedido ${order.code}`}
                >
                  Cancelar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={Boolean(orderPendingDeletion)}
        title="Cancelar pedido?"
        description={orderPendingDeletion ? `O pedido #${orderPendingDeletion.code} será removido e o acesso revogado. Esta ação não pode ser desfeita.` : ''}
        confirmLabel="Cancelar pedido"
        isDanger
        isLoading={isDeleting}
        onConfirm={handleConfirmDeletion}
        onClose={() => setOrderPendingDeletion(null)}
      />
    </>
  );
}
