'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlistContext } from '@/contexts/WishlistContext';
import { useCartContext } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Danh sách yêu thích</span>
          </nav>
        </div>

        {/* Wishlist Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h1 className="text-3xl font-bold mb-8">Danh sách yêu thích ({wishlist.totalItems})</h1>

          {wishlist.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    <p className="text-gray-500 mb-4">{item.price.toLocaleString('vi-VN')}₫</p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        // Thêm sản phẩm vào giỏ hàng với size mặc định
                        const defaultSize = item.sizes[0];
                        if (defaultSize) {
                          addToCart({
                            ...item,
                            size: defaultSize,
                            stock: item.stock[defaultSize] || 0
                          });
                        }
                      }}
                      className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-heart text-4xl text-gray-400"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">Danh sách yêu thích trống</h2>
              <p className="text-gray-600 mb-8">Hãy khám phá các sản phẩm của chúng tôi</p>
              <Link 
                href="/shop" 
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 inline-block"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
} 