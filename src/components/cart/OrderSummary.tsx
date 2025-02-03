"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/utils/format";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping = 30000,
}) => {
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính:</span>
          <span>{formatPrice(subtotal)}₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span>
            {subtotal >= 1000000 ? "Miễn phí" : `${formatPrice(shipping)}₫`}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="text-xl font-bold">{formatPrice(total)}₫</span>
        </div>

        <Link
          href="/checkout"
          className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Thanh toán
        </Link>
      </div>

      {/* Free Shipping Notice */}
      {subtotal < 1000000 && (
        <div className="mt-4 text-sm text-gray-600">
          Mua thêm{" "}
          <span className="font-medium">
            {formatPrice(1000000 - subtotal)}₫
          </span>{" "}
          để được miễn phí vận chuyển
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
