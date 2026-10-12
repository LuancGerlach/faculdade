import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const product = { id: 1, title: 'Curso', type: 'CURSO', category: 'Táticas', price: 79 };
const secondProduct = { id: 2, title: 'E-book', type: 'EBOOK', category: 'Granadas', price: 39 };

describe('CartContext', () => {
  it('adiciona sem duplicar, calcula subtotal e remove', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
      result.current.addToCart(secondProduct);
    });
    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.subtotal).toBe(118);

    act(() => result.current.removeFromCart(1));
    expect(result.current.cartItems.map((cartItem) => cartItem.id)).toEqual([2]);
  });

  it('persiste o carrinho no localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addToCart(product));
    expect(JSON.parse(localStorage.getItem('cs2market:cart'))).toHaveLength(1);
  });
});
