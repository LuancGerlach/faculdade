// Traduz ApiError em mensagens para a interface
export function getErrorMessage(error, fallbackMessage = 'Algo deu errado. Tente novamente.') {
  return error?.message || fallbackMessage;
}

export function getErrorStatus(error) {
  return error?.status;
}

// Distribui os erros da API nos campos do formulário. Devolve a mensagem geral, se não couber em nenhum campo
export function applyServerErrors(error, setFieldErrors) {
  if (error?.fields?.length) {
    setFieldErrors(Object.fromEntries(error.fields.map((fieldError) => [fieldError.field, fieldError.message])));
    return null;
  }
  if (error?.status === 409) {
    const conflictField = error.message.toLowerCase().includes('cpf') ? 'cpf' : 'email';
    setFieldErrors({ [conflictField]: error.message });
    return null;
  }
  return getErrorMessage(error);
}
