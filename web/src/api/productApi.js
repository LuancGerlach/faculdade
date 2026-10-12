import { httpClient } from './httpClient';

export const findProducts = (filters) => httpClient.get('/api/products', filters);

export const findProductById = (productId) => httpClient.get(`/api/products/${productId}`);
