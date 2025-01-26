"use client";

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/types/cart';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, quantity: number) => void;
  onRemoveItem: (id: string, size: string) => void;
}

export default function CartItems({ items, onUpdateQuantity, onRemoveItem }: CartItemsProps) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={`${item._id}-${item.size}`} className="flex gap-6 p-4 bg-white rounded-lg shadow-sm">
          {/* Product Image */}
          <div className="relative w-24 h-24">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-md"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <button
                onClick={() => onRemoveItem(item._id, item.size)}
                className="text-gray-400 hover:text-red-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              <p>Size: {item.size}</p>
              <p>Giá: {item.price.toLocaleString('vi-VN')}₫</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item._id, item.size, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                disabled={item.quantity <= 1}
              >
                <i className="fas fa-minus text-sm"></i>
              </button>

              <span className="w-12 text-center">{item.quantity}</span>

              <button
                onClick={() => onUpdateQuantity(item._id, item.size, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                disabled={item.quantity >= item.stock}
              >
                <i className="fas fa-plus text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 