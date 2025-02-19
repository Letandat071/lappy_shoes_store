'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  stock: { [key: string]: number };
}

interface WishlistContextType {
  wishlist: {
    items: WishlistItem[];
    totalItems: number;
  };
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<{ items: WishlistItem[]; totalItems: number }>({
    items: [],
    totalItems: 0,
  });

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userWishlistKey = `wishlist_${user.id}`;
      const savedWishlist = localStorage.getItem(userWishlistKey);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      } else {
        setWishlist({ items: [], totalItems: 0 });
      }
    } else {
      // Khi không có user, reset wishlist về rỗng
      setWishlist({ items: [], totalItems: 0 });
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const userWishlistKey = `wishlist_${user.id}`;
      localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = async (product: WishlistItem) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    const existingItem = wishlist.items.find(item => item._id === product._id);
    if (existingItem) {
      toast('Sản phẩm đã có trong danh sách yêu thích', {
        icon: '👌',
      });
      return;
    }

    // Thêm sản phẩm vào wishlist
    setWishlist(prev => ({
      items: [...prev.items, product],
      totalItems: prev.totalItems + 1,
    }));

    toast.success('Đã thêm vào danh sách yêu thích');
  };

  const removeFromWishlist = (productId: string) => {
    if (!user) return;

    // Xóa sản phẩm khỏi wishlist
    setWishlist(prev => ({
      items: prev.items.filter(item => item._id !== productId),
      totalItems: prev.totalItems - 1,
    }));

    toast.success('Đã xóa khỏi danh sách yêu thích');
  };

  const clearWishlist = () => {
    if (!user) return;

    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
      setWishlist({
        items: [],
        totalItems: 0,
      });
      toast.success('Đã xóa tất cả sản phẩm');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.items.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
} 