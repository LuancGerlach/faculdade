import axios from 'axios';

// Vazio = mesmo domínio (Vercel). Em dev o Vite faz proxy de /api para a API local
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

export default api;
