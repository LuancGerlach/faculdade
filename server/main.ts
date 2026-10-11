import { createApp } from './app.js';
import { env, isDatabaseConfigured } from './config/env.js';

// Equivalente ao UrlshortenerApplication#main (uso local)
createApp().listen(env.PORT, () => {
  const storage = isDatabaseConfigured ? 'Postgres (Neon)' : 'memória';
  console.log(`API rodando em http://localhost:${env.PORT}/api  |  storage: ${storage}`);
});
