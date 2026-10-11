import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

const validUser = {
  name: 'Maria Souza',
  email: 'maria@email.com',
  cpf: '529.982.247-25',
  password: 'senha1234',
  confirmPassword: 'senha1234',
  acceptedTerms: true,
};

describe('API REST', () => {
  it('GET /api/products filtra por tipo', async () => {
    const response = await request(app).get('/api/products?type=PACOTE');
    expect(response.status).toBe(200);
    expect(response.body.every((product: { type: string }) => product.type === 'PACOTE')).toBe(true);
  });

  it('GET /api/products/:id devolve 404 padronizado', async () => {
    const response = await request(app).get('/api/products/999');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ status: 404, path: '/api/products/999' });
  });

  it('POST /api/users devolve 400 com erros por campo', async () => {
    const response = await request(app).post('/api/users').send({ ...validUser, email: 'invalido' });
    expect(response.status).toBe(400);
    expect(response.body.fields).toContainEqual({ field: 'email', message: 'E-mail inválido' });
  });

  it('fluxo completo: cadastro → pedido → reenvio → exclusão', async () => {
    const createdUser = await request(app).post('/api/users').send(validUser);
    expect(createdUser.status).toBe(201);

    const duplicatedUser = await request(app).post('/api/users').send(validUser);
    expect(duplicatedUser.status).toBe(409);

    const updatedUser = await request(app)
      .put(`/api/users/${createdUser.body.id}`)
      .send({ name: 'Maria S.', email: 'maria.s@email.com' });
    expect(updatedUser.status).toBe(200);

    const createdOrder = await request(app)
      .post('/api/orders')
      .send({ userId: createdUser.body.id, productIds: [1], paymentMethod: 'PIX' });
    expect(createdOrder.status).toBe(201);
    expect(createdOrder.body.deliveryEmail).toBe('maria.s@email.com');

    const resentOrder = await request(app).patch(`/api/orders/${createdOrder.body.id}/resend-email`);
    expect(resentOrder.body.emailSentCount).toBe(2);

    const deletedOrder = await request(app).delete(`/api/orders/${createdOrder.body.id}`);
    expect(deletedOrder.status).toBe(204);
  });
});
