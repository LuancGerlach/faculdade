// Traduz o ErrorResponse da API (ou falha de rede) em mensagem para o usuário
export function getErrorMessage(error, fallbackMessage = 'Algo deu errado. Tente novamente.') {
  if (error?.code === 'ECONNABORTED') return 'A API demorou para responder. Tente novamente.';
  if (!error?.response) return 'Não foi possível conectar à API. Verifique sua conexão.';
  return error.response.data?.message || fallbackMessage;
}

export function getFieldErrors(error) {
  return error?.response?.data?.fields ?? [];
}

export function getErrorStatus(error) {
  return error?.response?.status;
}
