// Camada de acesso a dados do front: único ponto que conversa com a API REST via fetch
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const REQUEST_TIMEOUT_IN_MS = 15_000;

export class ApiError extends Error {
  constructor(message, status, fields = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

async function request(method, path, body, queryParams) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  Object.entries(queryParams ?? {})
    .filter(([, paramValue]) => paramValue !== undefined && paramValue !== '')
    .forEach(([paramName, paramValue]) => url.searchParams.set(paramName, paramValue));

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_IN_MS);

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: abortController.signal,
    });
  } catch (networkError) {
    const isTimeout = networkError.name === 'AbortError';
    throw new ApiError(
      isTimeout ? 'A API demorou para responder. Tente novamente.' : 'Não foi possível conectar à API. Verifique sua conexão.',
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 204) return null;

  const responseBody = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(responseBody?.message ?? 'Algo deu errado. Tente novamente.', response.status, responseBody?.fields);
  }
  return responseBody;
}

export const httpClient = {
  get: (path, queryParams) => request('GET', path, undefined, queryParams),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
