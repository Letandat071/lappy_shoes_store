"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShippingForm from '@/components/checkout/ShippingForm';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { useCartContext } from '@/contexts/CartContext';

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export default function CheckoutPage() {
  const { cart } = useCartContext();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1000000 ? 0 : 30000; // Miễn phí ship cho đơn >= 1tr
  const total = subtotal + shipping;

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:text-black">Giỏ hàng</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Thanh toán</span>
          </nav>
        </div>

        {/* Checkout Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Forms */}
            <div className="lg:w-2/3 space-y-6">
              <ShippingForm onSubmit={handleShippingSubmit} />
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <CheckoutSummary 
                items={cart.items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                shippingAddress={shippingAddress || undefined}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 