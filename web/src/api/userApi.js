import { httpClient } from './httpClient';

export const createUser = (userRequest) => httpClient.post('/api/users', userRequest);

export const updateUser = (userId, userRequest) => httpClient.put(`/api/users/${userId}`, userRequest);

export const login = (credentials) => httpClient.post('/api/auth/login', credentials);
