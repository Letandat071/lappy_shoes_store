'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WishlistItem from '@/components/wishlist/WishlistItem';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import ProductCard from '@/components/common/ProductCard';

// Mock data - trong thực tế sẽ lấy từ API
const mockWishlistItems = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    category: 'Running Collection',
    price: 150,
    originalPrice: 189.99,
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
  },
  {
    id: 2,
    name: 'Adidas Ultraboost',
    category: 'Performance Series',
    price: 180,
    rating: 5,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519'
  }
];

const recommendedProducts = [
  {
    id: 3,
    name: 'Nike Air Force 1',
    price: 120,
    originalPrice: 140,
    rating: 4.8,
    reviewCount: 256,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    category: 'Lifestyle',
    discount: 10
  }
  // Thêm các sản phẩm khác
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const handleAddToCart = (id: number) => {
    // Thêm logic thêm vào giỏ hàng ở đây
    console.log('Add to cart:', id);
  };

  const handleClearAll = () => {
    setWishlistItems([]);
  };

  return (
    <main className="bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
        <nav className="flex text-gray-500 text-sm">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Wishlist</span>
        </nav>
      </div>

      {/* Wishlist Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        {wishlistItems.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                My Wishlist ({wishlistItems.length})
              </h1>
              <button 
                onClick={handleClearAll}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {wishlistItems.map(item => (
                <WishlistItem
                  key={item.id}
                  product={item}
                  onRemove={handleRemoveFromWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyWishlist />
        )}
      </section>

      {/* Product Recommendations */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
} 