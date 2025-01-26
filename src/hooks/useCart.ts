'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Cart, CartItem } from '@/types/cart';

const CART_STORAGE_KEY = 'shoe_store_cart';

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : initialCart;
    }
    return initialCart;
  });

  const actionRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      
      if (actionRef.current) {
        toast.success(actionRef.current);
        actionRef.current = '';
      }
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    const existingItem = cart.items.find(item => 
      item._id === product._id && item.size === product.size
    );

    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        toast.error('Số lượng vượt quá tồn kho');
        return;
      }

      setCart(prevCart => {
        const updatedItems = prevCart.items.map(item =>
          item._id === product._id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        actionRef.current = 'Đã cập nhật số lượng trong giỏ hàng';
        return {
          items: updatedItems,
          totalItems: prevCart.totalItems + 1,
          totalPrice: prevCart.totalPrice + product.price
        };
      });
      return;
    }

    setCart(prevCart => {
      actionRef.current = 'Đã thêm vào giỏ hàng';
      return {
        items: [...prevCart.items, { ...product, quantity: 1 }],
        totalItems: prevCart.totalItems + 1,
        totalPrice: prevCart.totalPrice + product.price
      };
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    const item = cart.items.find(item => 
      item._id === productId && item.size === size
    );

    if (!item) return;

    setCart(prevCart => {
      actionRef.current = 'Đã xóa khỏi giỏ hàng';
      return {
        items: prevCart.items.filter(item => 
          !(item._id === productId && item.size === size)
        ),
        totalItems: prevCart.totalItems - item.quantity,
        totalPrice: prevCart.totalPrice - (item.price * item.quantity)
      };
    });
  };

  const updateQuantity = (productId: string, size: string, newQuantity: number) => {
    const item = cart.items.find(item => 
      item._id === productId && item.size === size
    );

    if (!item) return;

    if (newQuantity > item.stock) {
      toast.error('Số lượng vượt quá tồn kho');
      return;
    }

    if (newQuantity < 1) {
      toast.error('Số lượng không hợp lệ');
      return;
    }

    const quantityDiff = newQuantity - item.quantity;

    setCart(prevCart => {
      actionRef.current = 'Đã cập nhật số lượng';
      return {
        items: prevCart.items.map(item =>
          item._id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        ),
        totalItems: prevCart.totalItems + quantityDiff,
        totalPrice: prevCart.totalPrice + (item.price * quantityDiff)
      };
    });
  };

  const clearCart = () => {
    setCart(prevCart => {
      actionRef.current = 'Đã xóa giỏ hàng';
      return initialCart;
    });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}; 