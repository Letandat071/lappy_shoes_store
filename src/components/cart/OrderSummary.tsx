"use client";

import React from 'react';
import Link from 'next/link';
import { CartItem } from './CartItems';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
}

const OrderSummary = ({ items, subtotal, shipping, tax, discount = 0, total }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg sticky top-32">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-500">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link 
        href="/checkout" 
        className="block w-full bg-black text-white py-3 rounded-lg text-center hover:bg-gray-800 mb-4"
      >
        Proceed to Checkout
      </Link>

      <div className="text-center">
        <Link 
          href="/shop" 
          className="text-gray-600 hover:text-black inline-flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Continue Shopping
        </Link>
      </div>

      {/* Payment Methods */}
      <div className="border-t mt-6 pt-6">
        <p className="text-gray-600 text-sm mb-4">Secure Checkout</p>
        <div className="flex gap-4">
          <i className="fab fa-cc-visa text-3xl text-blue-600"></i>
          <i className="fab fa-cc-mastercard text-3xl text-red-500"></i>
          <i className="fab fa-cc-paypal text-3xl text-blue-800"></i>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 