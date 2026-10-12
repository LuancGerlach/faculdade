import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './RegisterPage';
import { renderWithProviders } from '../test/renderWithProviders';

async function fillValidForm(user) {
  await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
  await user.type(screen.getByLabelText(/e-mail/i), 'joao@email.com');
  await user.type(screen.getByLabelText(/cpf/i), '52998224725');
  await user.type(screen.getByLabelText(/^senha/i), 'senha1234');
  await user.type(screen.getByLabelText(/confirmar senha/i), 'senha1234');
  await user.click(screen.getByRole('checkbox'));
}

describe('RegisterPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mostra erro em todos os campos obrigatórios e foca o primeiro', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    renderWithProviders(<RegisterPage />, { route: '/cadastro' });

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(6);
    expect(screen.getByLabelText(/nome completo/i)).toHaveFocus();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('aplica máscara de CPF', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { route: '/cadastro' });
    await user.type(screen.getByLabelText(/cpf/i), '52998224725');
    expect(screen.getByLabelText(/cpf/i)).toHaveValue('529.982.247-25');
  });

  it('mostra no campo o conflito devolvido pela API (409)', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'E-mail já cadastrado', status: 409 }), { status: 409 }),
    );
    renderWithProviders(<RegisterPage />, { route: '/cadastro' });

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByText('E-mail já cadastrado')).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('envia o cadastro para a API quando válido', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 1, name: 'João Silva', email: 'joao@email.com', cpf: '529.***.***-25' }), { status: 201 }),
    );
    renderWithProviders(<RegisterPage />, { route: '/cadastro' });

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(await screen.findByText(/conta criada/i)).toBeInTheDocument();
    expect(fetchSpy.mock.calls[0][1].method).toBe('POST');
  });
});
