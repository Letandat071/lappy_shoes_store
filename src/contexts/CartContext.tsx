'use client';

import React, { createContext, useContext } from 'react';
import { useCart } from '@/hooks/useCart';
import { Cart, CartItem } from '@/types/cart';

interface CartContextType {
  cart: Cart;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (cart: Cart) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, setCart } = useCart();

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      setCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}; 