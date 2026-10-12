import { httpClient } from './httpClient';

export const createOrder = (orderRequest) => httpClient.post('/api/orders', orderRequest);

export const findOrderById = (orderId) => httpClient.get(`/api/orders/${orderId}`);

export const findOrdersByUser = (userId) => httpClient.get(`/api/users/${userId}/orders`);

export const resendOrderEmail = (orderId) => httpClient.patch(`/api/orders/${orderId}/resend-email`);

export const deleteOrder = (orderId) => httpClient.delete(`/api/orders/${orderId}`);

export const findCoupon = (couponCode) => httpClient.get(`/api/coupons/${encodeURIComponent(couponCode)}`);
