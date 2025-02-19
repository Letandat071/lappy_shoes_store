"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/utils/format";

// Xóa interface Product vì không sử dụng
// interface Product {
//   _id: string;
//   name: string;
//   images: { url: string }[];
//   price: number;
// }

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string | null;
    price: number;
  };
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  paymentStatus: string;
}

const statusMap = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        
        const data = await response.json();
        // Lọc ra các đơn hàng chưa hoàn thành hoặc hủy
        const activeOrders = data.orders.filter(
          (order: Order) => !["delivered", "cancelled"].includes(order.status)
        );
        setOrders(activeOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Đơn hàng gần đây</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Đơn hàng gần đây</h2>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-box-open text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
          <Link
            href="/shop"
            className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Đơn hàng gần đây</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Đơn hàng #{order._id?.slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  statusColors[order.status as keyof typeof statusColors]
                }`}
              >
                {statusMap[order.status as keyof typeof statusMap]}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.product._id}-${index}`} className="flex gap-4">
                  <div className="relative w-24 h-24">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-lg">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="font-semibold">{formatPrice(item.price)}₫</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="font-bold">
                Tổng cộng: {formatPrice(order.totalAmount)}₫
              </span>
              <Link
                href={`/orders/${order._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
