"use client";

import React, { useState } from 'react';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'credit-card' | 'paypal';
}

const PaymentForm = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit-card'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="credit-card"
            checked={formData.paymentMethod === 'credit-card'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit-card' }))}
          />
          <label htmlFor="credit-card" className="flex items-center gap-4 cursor-pointer">
            <i className="fab fa-cc-visa text-3xl text-blue-600"></i>
            <i className="fab fa-cc-mastercard text-3xl text-red-500"></i>
            <span>Credit Card</span>
          </label>
        </div>
        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-black">
          <input 
            type="radio" 
            name="paymentMethod" 
            id="paypal"
            checked={formData.paymentMethod === 'paypal'}
            onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
          />
          <label htmlFor="paypal" className="flex items-center gap-4 cursor-pointer">
            <i className="fab fa-cc-paypal text-3xl text-blue-800"></i>
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {/* Credit Card Form */}
      {formData.paymentMethod === 'credit-card' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input 
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input 
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input 
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
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