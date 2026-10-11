import type { ErrorRequestHandler, RequestHandler, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ResourceNotFoundException } from '../ResourceNotFoundException.js';
import { ConflictException } from '../ConflictException.js';
import { UnauthorizedException } from '../UnauthorizedException.js';
import { BusinessRuleException } from '../BusinessRuleException.js';
import type { ErrorResponse, FieldError } from '../dto/ErrorResponse.js';

// Equivalente ao @ControllerAdvice GlobalExceptionHandler
function buildErrorResponse(request: Request, status: number, message: string, fields?: FieldError[]): ErrorResponse {
  return {
    message,
    status,
    timestamp: new Date().toISOString(),
    path: request.originalUrl,
    ...(fields ? { fields } : {}),
  };
}

function sendError(request: Request, response: Response, status: number, message: string, fields?: FieldError[]) {
  response.status(status).json(buildErrorResponse(request, status, message, fields));
}

export const handleNoResourceFound: RequestHandler = (request, response) => {
  sendError(request, response, 404, 'Resource not found');
};

export const globalExceptionHandler: ErrorRequestHandler = (exception, request, response, _next) => {
  if (exception instanceof ZodError) {
    const fieldErrors = exception.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    sendError(request, response, 400, 'Dados inválidos', fieldErrors);
    return;
  }

  if (exception instanceof ResourceNotFoundException) {
    sendError(request, response, 404, exception.message);
    return;
  }

  if (exception instanceof ConflictException) {
    sendError(request, response, 409, exception.message);
    return;
  }

  if (exception instanceof UnauthorizedException) {
    sendError(request, response, 401, exception.message);
    return;
  }

  if (exception instanceof BusinessRuleException) {
    sendError(request, response, 422, exception.message);
    return;
  }

  if (exception instanceof SyntaxError) {
    sendError(request, response, 400, 'JSON malformado');
    return;
  }

  console.error('[GlobalExceptionHandler]', exception);
  sendError(request, response, 500, 'Erro interno do servidor');
};
