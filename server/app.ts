import express from 'express';
import { corsConfig } from './config/web.config.js';
import { buildRoutes } from './routes/index.js';
import { globalExceptionHandler, handleNoResourceFound } from './exception/handler/GlobalExceptionHandler.js';

export function createApp() {
  const app = express();

  app.use(corsConfig);
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'UP' });
  });

  app.use('/api', buildRoutes());

  app.use(handleNoResourceFound);
  app.use(globalExceptionHandler);

  return app;
}
