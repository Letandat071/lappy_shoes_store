"use client";

import React from 'react';
import Link from 'next/link';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
}

export default function OrderSummary({ subtotal, shipping, tax }: OrderSummaryProps) {
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">Tổng đơn hàng</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString('vi-VN')}₫</span>
        </div>

        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}₫`}</span>
        </div>

        <div className="flex justify-between">
          <span>Thuế (10%):</span>
          <span>{tax.toLocaleString('vi-VN')}₫</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full bg-black text-white py-3 rounded-full text-center block hover:bg-gray-800"
      >
        Thanh toán
      </Link>
    </div>
  );
} 