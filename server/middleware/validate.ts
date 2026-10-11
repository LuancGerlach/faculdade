import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

// Equivalente ao @Valid @RequestBody: valida e substitui o body pelo DTO já tipado
export function validateBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    request.body = schema.parse(request.body);
    next();
  };
}
