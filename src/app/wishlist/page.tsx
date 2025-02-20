'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const { user } = useAuth();

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-32">
          <div className="max-w-7xl mx-auto px-4 text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-lock text-4xl text-gray-400"></i>
            </div>
            <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">Để xem danh sách yêu thích của bạn</p>
            <Link 
              href="/auth" 
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 inline-block"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Danh sách yêu thích</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Danh sách yêu thích ({wishlist.totalItems})</h1>
                {wishlist.items.length > 0 && (
                  <button 
                    onClick={clearWishlist}
                    className="text-gray-600 hover:text-black"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {wishlist.items.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {wishlist.items.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center gap-6">
                        <Link href={`/product/${item._id}`} className="block">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={128}
                            height={128}
                            className="w-32 h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                          />
                        </Link>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={`/product/${item._id}`} className="block group">
                                <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                                <p className="text-gray-600 mb-2">Running Collection</p>
                                <div className="flex text-yellow-400 text-sm">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star${i === 4 ? '-half-alt' : ''}`}></i>
                                  ))}
                                  <span className="text-gray-600 ml-2">(128)</span>
                                </div>
                              </Link>
                            </div>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <span className="text-2xl font-bold">{formatPrice(item.price)}₫</span>
                              {item.originalPrice && (
                                <span className="text-gray-400 line-through ml-2">
                                  {formatPrice(item.originalPrice)}₫
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const defaultSize = item.sizes[0];
                                if (defaultSize) {
                                  addToCart({
                                    ...item,
                                    productId: item._id,
                                    size: defaultSize,
                                    quantity: 1,
                                    stock: item.stock[defaultSize] || 0
                                  });
                                }
                              }}
                              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="far fa-heart text-4xl text-gray-400"></i>
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

              {/* Product Recommendations */}
              <section className="mt-16">
                <h2 className="text-2xl font-bold mb-8">Có thể bạn cũng thích</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product cards will be added here */}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 