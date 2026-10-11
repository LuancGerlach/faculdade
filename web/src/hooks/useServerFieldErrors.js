import { getErrorMessage, getErrorStatus, getFieldErrors } from '../api/errorHandler';

// Leva os erros por campo da API (400) e conflitos (409) para o react-hook-form
export function applyServerErrors(requestError, setError) {
  const fieldErrors = getFieldErrors(requestError);
  fieldErrors.forEach((fieldError) => setError(fieldError.field, { type: 'server', message: fieldError.message }));

  const errorMessage = getErrorMessage(requestError);
  if (getErrorStatus(requestError) === 409) {
    const conflictField = errorMessage.toLowerCase().includes('cpf') ? 'cpf' : 'email';
    setError(conflictField, { type: 'server', message: errorMessage }, { shouldFocus: true });
    return null;
  }

  return fieldErrors.length ? null : errorMessage;
}
