'use client';

import React, { createContext, useContext } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { Wishlist, WishlistItem } from '@/types/wishlist';

interface WishlistContextType {
  wishlist: Wishlist;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wishlistUtils = useWishlist();

  return (
    <WishlistContext.Provider value={wishlistUtils}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
}; 