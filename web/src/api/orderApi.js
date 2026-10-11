import api from './axios';

export const createOrder = (orderRequest) => api.post('/api/orders', orderRequest);

export const findOrderById = (orderId) => api.get(`/api/orders/${orderId}`);

export const findOrdersByUser = (userId) => api.get(`/api/users/${userId}/orders`);

export const resendOrderEmail = (orderId) => api.patch(`/api/orders/${orderId}/resend-email`);

export const deleteOrder = (orderId) => api.delete(`/api/orders/${orderId}`);

export const findCoupon = (couponCode) => api.get(`/api/coupons/${encodeURIComponent(couponCode)}`);
