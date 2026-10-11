import type { RequestHandler } from 'express';
import { env } from './env.js';

// Equivalente ao WebConfig#addCorsMappings
const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
const allowedMethods = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';

export const corsConfig: RequestHandler = (request, response, next) => {
  const requestOrigin = request.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    response.setHeader('Access-Control-Allow-Origin', requestOrigin);
    response.setHeader('Access-Control-Allow-Methods', allowedMethods);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Max-Age', '3600');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
};
