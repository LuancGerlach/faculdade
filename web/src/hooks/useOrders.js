import { useCallback, useEffect, useState } from 'react';
import { findOrdersByUser } from '../api/orderApi';
import { getErrorMessage, getErrorStatus } from '../api/errorHandler';

export function useOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userOrders = await findOrdersByUser(userId);
      setOrders(userOrders);
    } catch (requestError) {
      setError({ message: getErrorMessage(requestError, 'Não foi possível carregar suas compras.'), status: getErrorStatus(requestError) });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const replaceOrder = (updatedOrder) =>
    setOrders((currentOrders) => currentOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
  const removeOrder = (orderId) => setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));

  return { orders, isLoading, error, refetch: fetchOrders, replaceOrder, removeOrder };
}
