'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Wishlist, WishlistItem } from '@/types/wishlist';

const WISHLIST_STORAGE_KEY = 'shoe_store_wishlist';

const initialWishlist: Wishlist = {
  items: [],
  totalItems: 0
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Wishlist>(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return savedWishlist ? JSON.parse(savedWishlist) : initialWishlist;
    }
    return initialWishlist;
  });

  const actionRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));

      if (actionRef.current) {
        toast.success(actionRef.current);
        actionRef.current = '';
      }
    }
  }, [wishlist]);

  const addToWishlist = (product: WishlistItem) => {
    const existingItem = wishlist.items.find(item => item._id === product._id);

    if (existingItem) {
      toast.error('Sản phẩm đã có trong danh sách yêu thích');
      return;
    }

    setWishlist(prevWishlist => {
      actionRef.current = 'Đã thêm vào danh sách yêu thích';
      return {
        items: [...prevWishlist.items, product],
        totalItems: prevWishlist.totalItems + 1
      };
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist => {
      actionRef.current = 'Đã xóa khỏi danh sách yêu thích';
      return {
        items: prevWishlist.items.filter(item => item._id !== productId),
        totalItems: prevWishlist.totalItems - 1
      };
    });
  };

  const clearWishlist = () => {
    actionRef.current = 'Đã xóa danh sách yêu thích';
    setWishlist(initialWishlist);
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.items.some(item => item._id === productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };
}; 