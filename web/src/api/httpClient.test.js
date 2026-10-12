import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, httpClient } from './httpClient';
import { applyServerErrors } from './errorHandler';

const mockFetchResponse = (status, body) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body ? JSON.stringify(body) : null, { status }));

describe('httpClient', () => {
  afterEach(() => vi.restoreAllMocks());

  it('GET envia query params e devolve o JSON', async () => {
    const fetchSpy = mockFetchResponse(200, [{ id: 1 }]);
    const products = await httpClient.get('/api/products', { type: 'CURSO', search: '' });
    expect(products).toEqual([{ id: 1 }]);
    expect(String(fetchSpy.mock.calls[0][0])).toContain('/api/products?type=CURSO');
  });

  it('POST envia corpo JSON', async () => {
    const fetchSpy = mockFetchResponse(201, { id: 7 });
    await httpClient.post('/api/users', { name: 'João' });
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({ method: 'POST', body: '{"name":"João"}' });
  });

  it('DELETE com 204 devolve null', async () => {
    mockFetchResponse(204);
    await expect(httpClient.delete('/api/orders/1')).resolves.toBeNull();
  });

  it('transforma ErrorResponse em ApiError com status e campos', async () => {
    mockFetchResponse(400, { message: 'Dados inválidos', status: 400, fields: [{ field: 'email', message: 'E-mail inválido' }] });
    const requestError = await httpClient.post('/api/users', {}).catch((error) => error);
    expect(requestError).toBeInstanceOf(ApiError);
    expect(requestError).toMatchObject({ status: 400, message: 'Dados inválidos' });
    expect(requestError.fields).toHaveLength(1);
  });

  it('falha de rede vira mensagem amigável', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(httpClient.get('/api/products')).rejects.toMatchObject({ status: 0, message: expect.stringContaining('conectar') });
  });
});

describe('applyServerErrors', () => {
  it('distribui erros de validação nos campos', () => {
    const setFieldErrors = vi.fn();
    const generalMessage = applyServerErrors(new ApiError('x', 400, [{ field: 'email', message: 'E-mail inválido' }]), setFieldErrors);
    expect(setFieldErrors).toHaveBeenCalledWith({ email: 'E-mail inválido' });
    expect(generalMessage).toBeNull();
  });

  it('mapeia conflito de CPF para o campo cpf', () => {
    const setFieldErrors = vi.fn();
    applyServerErrors(new ApiError('CPF já cadastrado', 409), setFieldErrors);
    expect(setFieldErrors).toHaveBeenCalledWith({ cpf: 'CPF já cadastrado' });
  });

  it('devolve mensagem geral para outros erros', () => {
    expect(applyServerErrors(new ApiError('Erro interno do servidor', 500), vi.fn())).toBe('Erro interno do servidor');
  });
});
