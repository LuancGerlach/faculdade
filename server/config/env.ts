import 'dotenv/config';
import { z } from 'zod';

// Equivalente ao application.yaml: lê e valida as variáveis de ambiente no boot
const environmentSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().optional().default(''),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
});

export const env = environmentSchema.parse(process.env);

export const isDatabaseConfigured = env.DATABASE_URL.trim().length > 0;
