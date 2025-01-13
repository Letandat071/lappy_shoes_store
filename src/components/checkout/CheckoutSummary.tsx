import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

interface CheckoutSummaryProps {
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
}) => {
  const router = useRouter();

  const handlePlaceOrder = () => {
    // Giả lập xử lý đặt hàng với tỷ lệ thành công 80%
    const isSuccess = Math.random() < 0.8;
    
    setTimeout(() => {
      if (isSuccess) {
        router.push('/checkout/success');
      } else {
        router.push('/checkout/failed');
      }
    }, 1500); // Đợi 1.5s để giả lập quá trình xử lý
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 80px, 80px"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {item.size} | Color: {item.color}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm">Qty: {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button 
        className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-600 mb-4">Secure Payment Methods</p>
        <div className="flex gap-4">
          <i className="fab fa-cc-visa text-3xl text-blue-600"></i>
          <i className="fab fa-cc-mastercard text-3xl text-red-500"></i>
          <i className="fab fa-cc-paypal text-3xl text-blue-800"></i>
          <i className="fab fa-cc-apple-pay text-3xl text-gray-800"></i>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t text-center">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <i className="fas fa-lock mr-2"></i>
          <span>SSL Secure Payment</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary; 