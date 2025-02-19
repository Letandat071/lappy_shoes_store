'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Cart, CartItem } from '@/types/cart';
import { toast } from 'react-hot-toast';

export function useCart() {
  const { user } = useAuth();
  const [cart, setCartState] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userCartKey = `cart_${user.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartState(parsedCart);
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartState({ items: [], totalItems: 0, totalPrice: 0 });
        }
      }
    } else {
      setCartState({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [user]);

  // Save cart to localStorage when cart changes
  useEffect(() => {
    if (user && cart) {
      try {
        const userCartKey = `cart_${user.id}`;
        localStorage.setItem(userCartKey, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cart, user]);

  const setCart = (newCart: Cart) => {
    setCartState(newCart);
  };

  const addToCart = (product: CartItem) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    // Kiểm tra sản phẩm tồn tại trước khi setState
    const existingItem = cart.items.find(
      item => item.productId === product.productId && item.size === product.size
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + product.quantity;
      
      if (newQuantity > existingItem.stock) {
        toast.error('Số lượng vượt quá tồn kho');
        return;
      }

      setCartState(prev => ({
        items: prev.items.map(item =>
          item.productId === product.productId && item.size === product.size
            ? { ...item, quantity: newQuantity }
            : item
        ),
        totalItems: prev.totalItems + product.quantity,
        totalPrice: prev.totalPrice + (product.price * product.quantity)
      }));

      toast.success('Đã cập nhật số lượng trong giỏ hàng');
      return;
    }

    // Thêm sản phẩm mới
    setCartState(prev => ({
      items: [...prev.items, product],
      totalItems: prev.totalItems + product.quantity,
      totalPrice: prev.totalPrice + (product.price * product.quantity)
    }));

    toast.success('Đã thêm vào giỏ hàng');
  };

  const removeFromCart = (productId: string, size: string) => {
    if (!user) return;

    const item = cart.items.find(i => i.productId === productId && i.size === size);
    if (!item) return;

    // Thêm confirm trước khi xóa
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setCartState(prev => ({
        items: prev.items.filter(i => !(i.productId === productId && i.size === size)),
        totalItems: prev.totalItems - item.quantity,
        totalPrice: prev.totalPrice - (item.price * item.quantity)
      }));

      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (!user) return;

    const item = cart.items.find(i => i.productId === productId && i.size === size);
    if (!item) return;

    // Nếu quantity = 0, xóa sản phẩm
    if (quantity === 0) {
      removeFromCart(productId, size);
      return;
    }

    // Kiểm tra tồn kho
    if (quantity > item.stock) {
      toast.error('Số lượng vượt quá tồn kho');
      return;
    }

    const quantityDiff = quantity - item.quantity;
    
    setCartState(prev => ({
      items: prev.items.map(i => 
        i.productId === productId && i.size === size
          ? { ...i, quantity }
          : i
      ),
      totalItems: prev.totalItems + quantityDiff,
      totalPrice: prev.totalPrice + (item.price * quantityDiff)
    }));

    // Thêm thông báo khi cập nhật thành công
    toast.success('Đã cập nhật số lượng');
  };

  const clearCart = () => {
    if (!user) return;

    // Chỉ hiện thông báo xác nhận khi xóa thủ công từ trang giỏ hàng
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      setCartState({ items: [], totalItems: 0, totalPrice: 0 });
      toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
    }
  };

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
} 