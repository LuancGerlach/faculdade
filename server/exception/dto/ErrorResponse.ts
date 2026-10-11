export interface FieldError {
  field: string;
  message: string;
}

// Mesmo contrato do record ErrorResponse(message, status, timestamp) + campos inválidos
export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  fields?: FieldError[];
}
