"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils/format';
import { CartItem } from '@/types/cart';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
}

const CartItems = ({ items, onUpdateQuantity, onRemoveItem }: CartItemsProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.productId}-${item.size}`} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <Link href={`/product/${item.productId}`} className="shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <div>
                  <Link 
                    href={`/product/${item.productId}`}
                    className="text-lg font-medium hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-sm">Size: {item.size}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.productId, item.size)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.productId, item.size, parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-x py-1"
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    {formatPrice(item.price * item.quantity)}₫
                  </div>
                  {item.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice * item.quantity)}₫
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems; 