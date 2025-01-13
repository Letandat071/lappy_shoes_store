"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItems from '@/components/cart/CartItems';
import OrderSummary from '@/components/cart/OrderSummary';
import type { CartItem } from '@/components/cart/CartItems';

// Mock cart data
const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Nike Air Max 270",
    category: "Running Collection",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    size: "US 9",
    color: "Black",
    price: 150.00,
    originalPrice: 189.99,
    quantity: 1
  },
  {
    id: "2",
    name: "Adidas Ultra Boost",
    category: "Running Collection",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    size: "US 10",
    color: "White",
    price: 180.00,
    originalPrice: 200.00,
    quantity: 1
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10.00;
  const tax = subtotal * 0.1;
  const discount = 50.00;
  const total = subtotal + shipping + tax - discount;

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Shopping Cart</span>
          </nav>
        </div>

        {/* Cart Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3 space-y-6">
                <CartItems 
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <OrderSummary
                  items={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  discount={discount}
                  total={total}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-cart text-4xl text-gray-400"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Browse our products and start shopping</p>
              <Link 
                href="/shop" 
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
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