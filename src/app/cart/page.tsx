"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItems from '@/components/cart/CartItems';
import OrderSummary from '@/components/cart/OrderSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import { useCartContext } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCartContext();

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Giỏ hàng</span>
          </nav>
        </div>

        {/* Cart Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h1 className="text-3xl font-bold mb-8">Giỏ hàng ({cart.totalItems})</h1>

          {cart.items.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3 space-y-6">
                <CartItems 
                  items={cart.items}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                />
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <OrderSummary
                  subtotal={cart.totalPrice}
                  shipping={cart.totalPrice > 1000000 ? 0 : 30000}
                  tax={cart.totalPrice * 0.1}
                />
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </section>

        {/* Product Recommendations */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Add 4 product cards here */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 