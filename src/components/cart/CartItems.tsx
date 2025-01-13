"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-4">
          <Link href={`/product/${item.id}`} className="flex-shrink-0">
            <div className="relative w-24 h-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 96px, 96px"
              />
            </div>
          </Link>
          
          <div className="flex-grow">
            <Link href={`/product/${item.id}`} className="text-lg font-semibold hover:text-primary-600">
              {item.name}
            </Link>
            <div className="text-sm text-gray-500 mt-1">
              Size: {item.size} | Color: {item.color}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-lg font-semibold">${item.price * item.quantity}</div>
            </div>
          </div>
          
          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartItems; 