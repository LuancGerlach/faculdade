import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '../config/env.js';
import * as schema from './schema.js';

export function createDatabaseConnection() {
  const sqlClient = neon(env.DATABASE_URL);
  return drizzle(sqlClient, { schema });
}

export type Database = ReturnType<typeof createDatabaseConnection>;
