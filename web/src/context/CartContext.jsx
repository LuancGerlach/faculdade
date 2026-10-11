import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

const CART_STORAGE_KEY = 'cs2market:cart';
const CartContext = createContext(null);

// Produto digital: cada item entra uma única vez no carrinho
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStorage(CART_STORAGE_KEY, []));
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => writeStorage(CART_STORAGE_KEY, cartItems), [cartItems]);

  const isInCart = useCallback(
    (productId) => cartItems.some((cartItem) => cartItem.id === productId),
    [cartItems],
  );

  const addToCart = useCallback((product) => {
    setCartItems((currentItems) =>
      currentItems.some((cartItem) => cartItem.id === product.id)
        ? currentItems
        : [...currentItems, {
          id: product.id, title: product.title, type: product.type, category: product.category, price: product.price,
        }],
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((currentItems) => currentItems.filter((cartItem) => cartItem.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  const subtotal = cartItems.reduce((total, cartItem) => total + cartItem.price, 0);

  const cartValue = useMemo(
    () => ({ cartItems, subtotal, appliedCoupon, setAppliedCoupon, isInCart, addToCart, removeFromCart, clearCart }),
    [cartItems, subtotal, appliedCoupon, isInCart, addToCart, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cartContext = useContext(CartContext);
  if (!cartContext) throw new Error('useCart deve ser usado dentro de CartProvider');
  return cartContext;
}
