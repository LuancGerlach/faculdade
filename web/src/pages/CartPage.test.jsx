import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartPage from './CartPage';
import { useCart } from '../context/CartContext';
import { renderWithProviders } from '../test/renderWithProviders';

const sampleItem = {
  id: 1,
  title: 'Default de CT em Mirage',
  type: 'ebook',
  category: 'Mirage',
  price: 29.9,
};

// Coloca um item no carrinho real (CartProvider) antes de mostrar a página.
function CartPageWithItem() {
  const { addToCart } = useCart();
  useEffect(() => {
    addToCart(sampleItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <CartPage />;
}

describe('CartPage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('carrinho vazio mostra a mensagem e o link para o catálogo', () => {
    renderWithProviders(<CartPage />, { route: '/carrinho' });

    expect(screen.getByText('Carrinho vazio')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explorar catálogo/i })).toHaveAttribute('href', '/catalogo');
  });

  it('mostra o erro quando o cupom é inválido (404)', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Cupom inválido', status: 404 }), { status: 404 }),
    );
    renderWithProviders(<CartPageWithItem />, { route: '/carrinho' });

    await screen.findByText(sampleItem.title);
    await user.type(screen.getByLabelText(/cupom de desconto/i), 'CUPOMFALSO');
    await user.click(screen.getByRole('button', { name: /aplicar/i }));

    expect(await screen.findByText('Cupom inválido')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/cupom .* aplicado/i)).not.toBeInTheDocument();
  });

  it('remove o item ao confirmar no modal de remoção', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CartPageWithItem />, { route: '/carrinho' });

    await screen.findByText(sampleItem.title);
    await user.click(screen.getByRole('button', { name: /remover default de ct em mirage/i }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^remover$/i }));

    expect(await screen.findByText('Carrinho vazio')).toBeInTheDocument();
  });
});
