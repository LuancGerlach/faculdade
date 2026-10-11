import { z } from 'zod';

const idSchema = z.coerce.number().int().positive('Id inválido');

export function parseIdParam(rawId: unknown): number {
  return idSchema.parse(rawId);
}
