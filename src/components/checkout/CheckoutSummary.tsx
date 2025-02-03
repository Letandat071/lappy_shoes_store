"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/format";
import { CartItem } from "@/types/cart";
import { useCartContext } from "@/contexts/CartContext";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  estimatedTime: string;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  shipping,
  estimatedTime,
  onPlaceOrder,
  isProcessing,
}) => {
  const router = useRouter();
  const { clearCart } = useCartContext();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  const handlePlaceOrder = () => {
    if (paymentMethod === "ONLINE") {
      router.push("/checkout/payment");
      return;
    }

    onPlaceOrder();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-6">Thông tin đơn hàng</h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item._id}-${item.size}`} className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="font-medium mb-1">{item.name}</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Size: {item.size}</p>
                <div className="flex justify-between items-center">
                  <p>SL: {item.quantity}</p>
                  <p className="font-medium text-black">
                    {formatPrice(item.price * item.quantity)}₫
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(shipping)}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Thuế</span>
          <span>{formatPrice(0)}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Thời gian giao hàng</span>
          <span>{estimatedTime}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Tổng cộng</span>
          <span>{formatPrice(subtotal + shipping)}₫</span>
        </div>

        {/* Payment Method Selection */}
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value as "COD")}
                className="text-black"
              />
              <div>
                <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                <p className="text-sm text-gray-500">
                  Thanh toán bằng tiền mặt khi nhận hàng
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value as "ONLINE")}
                className="text-black"
              />
              <div>
                <p className="font-medium">Thanh toán trực tuyến</p>
                <p className="text-sm text-gray-500">
                  Thanh toán qua VNPay, Momo, thẻ ngân hàng
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        onClick={handlePlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing
          ? "Đang xử lý..."
          : paymentMethod === "COD"
          ? "Đặt hàng"
          : "Tiến hành thanh toán"}
      </button>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-600 mb-4">Phương thức thanh toán</p>
        <div className="flex gap-4">
          <i className="fab fa-cc-visa text-3xl text-blue-600"></i>
          <i className="fab fa-cc-mastercard text-3xl text-red-500"></i>
          <i className="fas fa-money-bill-wave text-3xl text-green-600"></i>
          <i className="fas fa-wallet text-3xl text-pink-600"></i>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t text-center">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <i className="fas fa-lock mr-2"></i>
          <span>Thanh toán bảo mật</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
