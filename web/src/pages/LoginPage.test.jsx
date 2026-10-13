import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('LoginPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mostra erro nos campos vazios, foca o primeiro e não chama a API', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.click(screen.getByRole('button', { name: /^entrar$/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByLabelText(/e-mail/i)).toHaveFocus();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('mostra "E-mail ou senha inválidos" quando a API responde 401', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'E-mail ou senha inválidos', status: 401 }), { status: 401 }),
    );
    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.type(screen.getByLabelText(/e-mail/i), 'joao@email.com');
    await user.type(screen.getByLabelText(/^senha/i), 'senha1234');
    await user.click(screen.getByRole('button', { name: /^entrar$/i }));

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument();
  });
});
