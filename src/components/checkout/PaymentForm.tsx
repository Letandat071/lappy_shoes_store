"use client";

import React, { useState } from 'react';

interface PaymentFormData {
  paymentMethod: 'cod' | 'bank-transfer' | 'momo' | 'zalopay' | 'credit-card';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

const PaymentForm = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: 'cod'
  });

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>
      <div className="space-y-4">
        {/* COD */}
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="cod"
            checked={formData.paymentMethod === 'cod'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
          />
          <label htmlFor="cod" className="flex items-center gap-4 cursor-pointer flex-1">
            <i className="fas fa-money-bill-wave text-2xl text-green-600"></i>
            <div>
              <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
              <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
            </div>
          </label>
        </div>

        {/* Bank Transfer */}
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="bank-transfer"
            checked={formData.paymentMethod === 'bank-transfer'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank-transfer' }))}
          />
          <label htmlFor="bank-transfer" className="flex items-center gap-4 cursor-pointer flex-1">
            <i className="fas fa-university text-2xl text-blue-600"></i>
            <div>
              <span className="font-medium">Chuyển khoản ngân hàng</span>
              <p className="text-sm text-gray-500">Chuyển khoản qua tài khoản ngân hàng</p>
            </div>
          </label>
        </div>

        {/* Momo */}
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="momo"
            checked={formData.paymentMethod === 'momo'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'momo' }))}
          />
          <label htmlFor="momo" className="flex items-center gap-4 cursor-pointer flex-1">
            <i className="fas fa-wallet text-2xl text-pink-600"></i>
            <div>
              <span className="font-medium">Ví MoMo</span>
              <p className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</p>
            </div>
          </label>
        </div>

        {/* ZaloPay */}
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="zalopay"
            checked={formData.paymentMethod === 'zalopay'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'zalopay' }))}
          />
          <label htmlFor="zalopay" className="flex items-center gap-4 cursor-pointer flex-1">
            <i className="fas fa-wallet text-2xl text-blue-500"></i>
            <div>
              <span className="font-medium">ZaloPay</span>
              <p className="text-sm text-gray-500">Thanh toán qua ví điện tử ZaloPay</p>
            </div>
          </label>
        </div>

        {/* Credit Card */}
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="credit-card"
            checked={formData.paymentMethod === 'credit-card'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit-card' }))}
          />
          <label htmlFor="credit-card" className="flex items-center gap-4 cursor-pointer flex-1">
            <div className="flex gap-2">
              <i className="fab fa-cc-visa text-2xl text-blue-600"></i>
              <i className="fab fa-cc-mastercard text-2xl text-red-500"></i>
            </div>
            <div>
              <span className="font-medium">Thẻ tín dụng/ghi nợ</span>
              <p className="text-sm text-gray-500">Thanh toán bằng thẻ Visa, Mastercard</p>
            </div>
          </label>
        </div>
      </div>

      {/* Credit Card Form */}
      {formData.paymentMethod === 'credit-card' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ</label>
            <input 
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
              <input 
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                placeholder="MM/YY"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã CVV</label>
              <input 
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                placeholder="123"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm; 