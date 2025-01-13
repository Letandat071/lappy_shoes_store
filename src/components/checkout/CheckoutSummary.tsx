import React from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface CheckoutSummaryProps {
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
}

const CheckoutSummary = ({
  items = [
    {
      id: '1',
      name: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      size: 'US 9',
      quantity: 1,
      price: 150.00
    }
  ],
  subtotal = 450.00,
  shipping = 10.00,
  tax = 45.00,
  discount = 50.00
}: CheckoutSummaryProps) => {
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg sticky top-32">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img 
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Size: {item.size} | Qty: {item.quantity}
              </p>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-500">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link 
        href="/checkout/success" 
        className="block w-full bg-black text-white py-3 rounded-lg text-center hover:bg-gray-800 mb-4"
      >
        Place Order
      </Link>

      <p className="text-sm text-gray-600 text-center">
        By placing your order, you agree to our{' '}
        <Link href="/terms" className="text-black hover:underline">
          Terms & Conditions
        </Link>
      </p>
    </div>
  );
};

export default CheckoutSummary; 