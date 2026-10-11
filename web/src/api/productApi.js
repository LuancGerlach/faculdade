import api from './axios';

export const findProducts = (filters) => api.get('/api/products', { params: filters });

export const findProductById = (productId) => api.get(`/api/products/${productId}`);
