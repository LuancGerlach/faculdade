import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from './FormField';
import { ConfirmModal } from './Modal';
import ProductCard from './ProductCard';
import { renderWithProviders } from '../test/renderWithProviders';

describe('FormField', () => {
  it('associa label, dica e erro ao input', () => {
    const { rerender } = render(<FormField id="email" label="E-mail" hint="Usado na entrega" required onChange={() => {}} value="" />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    expect(emailInput).toHaveAccessibleDescription('Usado na entrega');
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');

    rerender(<FormField id="email" label="E-mail" error="E-mail inválido" required onChange={() => {}} value="" />);
    expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail inválido');
  });
});

describe('ConfirmModal', () => {
  it('abre como dialog, confirma e fecha com ESC', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();
    render(<ConfirmModal isOpen title="Remover item?" description="Sairá do carrinho." onConfirm={handleConfirm} onClose={handleClose} confirmLabel="Remover" />);

    expect(screen.getByRole('dialog', { name: 'Remover item?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remover' }));
    expect(handleConfirm).toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  it('não renderiza quando fechado', () => {
    render(<ConfirmModal isOpen={false} title="X" onConfirm={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('ProductCard', () => {
  const product = { id: 1, title: 'Default de CT em Mirage', type: 'CURSO', category: 'Táticas', price: 79, rating: 4.9, badge: 'TOP' };

  it('mostra dados e adiciona ao carrinho uma única vez', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByRole('link', { name: product.title })).toHaveAttribute('href', '/produto/1');
    expect(screen.getByText('R$ 79,00', { exact: false })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /adicionar default/i }));
    expect(screen.getByRole('button', { name: /já está no carrinho/i })).toBeDisabled();
    expect(await screen.findByText(/adicionado ao carrinho/i)).toBeInTheDocument();
  });
});
