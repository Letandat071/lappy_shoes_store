"use client";

import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  category: string;
  image: string;
  size: string;
  color: string;
  price: number;
  originalPrice: number;
  quantity: number;
}

const CartItems = () => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Nike Air Max 270',
      category: 'Running Collection',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      size: 'US 9',
      color: 'Black',
      price: 150.00,
      originalPrice: 189.99,
      quantity: 1
    }
  ]);

  const handleQuantityChange = (id: string, change: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setItems([]);
  };

  return (
    <>
      {/* Cart Items */}
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-6">
            <img 
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.category}</p>
                  <div className="space-x-4 text-sm">
                    <span>Size: {item.size}</span>
                    <span>Color: {item.color}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center border-2 rounded-lg">
                  <button 
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={item.quantity}
                    readOnly
                    className="w-16 text-center border-x-2"
                  />
                  <button 
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div>
                  <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                  <span className="text-gray-400 line-through ml-2">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Cart Actions */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div className="flex gap-4">
          <input 
            type="text"
            placeholder="Enter coupon code"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            Apply
          </button>
        </div>
        <button 
          onClick={handleClearCart}
          className="text-gray-600 hover:text-black"
        >
          Clear Cart
        </button>
      </div>
    </>
  );
};

export default CartItems; 