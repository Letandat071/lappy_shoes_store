"use client";

import React from 'react';
import Link from 'next/link';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
  items
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
      
      {/* Items Summary */}
      <div className="mb-4 text-sm text-gray-600">
        <p>{items.length} items in cart</p>
      </div>

      {/* Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout" className="block">
        <button className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors">
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
};

export default OrderSummary; 