"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

// Mock checkout data
const mockCheckoutItems: CheckoutItem[] = [
  {
    id: "1",
    name: "Nike Air Max 270",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    size: "US 9",
    color: "Black",
    price: 150.00,
    quantity: 1
  },
  {
    id: "2",
    name: "Adidas Ultra Boost",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    size: "US 10",
    color: "White",
    price: 180.00,
    quantity: 1
  }
];

export default function CheckoutPage() {
  const [items] = useState<CheckoutItem[]>(mockCheckoutItems);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10.00;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:text-black">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Checkout</span>
          </nav>
        </div>

        {/* Checkout Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Forms */}
            <div className="lg:w-2/3">
              <ShippingForm />
              <PaymentForm />
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <CheckoutSummary 
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 