"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const paymentMethods = [
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Thanh toán qua VNPay QR',
    icon: '/images/payment/vnpay.png'
  },
  {
    id: 'momo',
    name: 'Momo',
    description: 'Ví điện tử Momo',
    icon: '/images/payment/momo.png'
  },
  {
    id: 'bank',
    name: 'Thẻ ATM/Internet Banking',
    description: 'Hỗ trợ hầu hết ngân hàng tại Việt Nam',
    icon: '/images/payment/bank.png'
  }
];

export default function PaymentPage() {
  const router = useRouter();

  const handlePayment = async (methodId: string) => {
    try {
      // Gọi API để tạo yêu cầu thanh toán
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: methodId
        })
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const data = await response.json();
      
      // Chuyển hướng đến trang thanh toán của đối tác
      window.location.href = data.paymentUrl;

    } catch (error) {
      console.error('Payment error:', error);
      router.push('/checkout/failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Chọn phương thức thanh toán</h1>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handlePayment(method.id)}
            className="w-full flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative w-12 h-12">
              <Image
                src={method.icon}
                alt={method.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium">{method.name}</h3>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          Quay lại
        </button>
      </div>

      {/* Security Badge */}
      <div className="mt-8 pt-8 border-t">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <i className="fas fa-lock mr-2"></i>
          <span>Thanh toán được mã hóa và bảo mật</span>
        </div>
      </div>
    </div>
  );
} 