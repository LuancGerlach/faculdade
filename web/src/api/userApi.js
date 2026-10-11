import api from './axios';

export const createUser = (userRequest) => api.post('/api/users', userRequest);

export const updateUser = (userId, userRequest) => api.put(`/api/users/${userId}`, userRequest);

export const findUserById = (userId) => api.get(`/api/users/${userId}`);

export const login = (credentials) => api.post('/api/auth/login', credentials);
