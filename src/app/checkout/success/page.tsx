'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </p>
        <div className="space-y-4">
          <Link
            href="/shop"
            className="block w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/account/orders"
            className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
} 