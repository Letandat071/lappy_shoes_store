"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/utils/format";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  size: string;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  images: { url: string }[];
  price: number;
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

const orderTabs = [
  { id: "all", label: "Tất cả", icon: "fas fa-shopping-bag" },
  {
    id: "processing",
    label: "Đã đặt",
    icon: "fas fa-clock",
    statuses: ["pending", "processing"],
  },
  {
    id: "shipping",
    label: "Đang vận chuyển",
    icon: "fas fa-shipping-fast",
    statuses: ["shipped"],
  },
  {
    id: "completed",
    label: "Hoàn thành",
    icon: "fas fa-check-circle",
    statuses: ["delivered"],
  },
  {
    id: "cancelled",
    label: "Đã hủy",
    icon: "fas fa-times-circle",
    statuses: ["cancelled"],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Lấy đơn hàng từ API khi component được mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (response.ok) {
        const ordersWithProducts = await Promise.all(
          data.orders.map(async (order: Order) => {
            const itemsWithProducts = await Promise.all(
              order.items.map(async (item) => {
                const productResponse = await fetch(
                  `/api/products/${item.product._id}`
                );
                const productData = await productResponse.json();
                return {
                  ...item,
                  product: {
                    ...item.product,
                    image: productData.images[0]?.url || "/default-image.png",
                    name: productData.name,
                    price: productData.price,
                  },
                };
              })
            );
            return { ...order, items: itemsWithProducts };
          })
        );
        setOrders(ordersWithProducts);
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } catch (_error) {
      toast.error("Có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    const tab = orderTabs.find((tab) => tab.id === activeTab);
    return tab?.statuses?.includes(order.status);
  });

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Hủy đơn hàng thành công");
        fetchOrders();
      } else {
        const data = await response.json();
        toast.error(data.error || "Không thể hủy đơn hàng");
      }
    } catch (_error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  const getOrderCount = (tabId: string) => {
    if (tabId === "all") return orders.length;
    const tab = orderTabs.find((tab) => tab.id === tabId);
    return orders.filter((order) => tab?.statuses?.includes(order.status))
      .length;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-8">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">Đơn hàng của tôi</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

              {/* Order Tabs */}
              <div className="mb-8 border-b">
                <div className="flex flex-wrap -mb-px">
                  {orderTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center px-4 py-3 mr-4 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <i className={`${tab.icon} mr-2`}></i>
                      {tab.label}
                      <span className="ml-2 text-xs bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full">
                        {getOrderCount(tab.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-box-open text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có đơn hàng nào
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === "all"
                      ? "Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!"
                      : `Bạn không có đơn hàng nào ở trạng thái ${orderTabs
                          .find((tab) => tab.id === activeTab)
                          ?.label.toLowerCase()}`}
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-6 border-b">
                        <div className="flex flex-wrap gap-4 justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Mã đơn hàng: #{order._id.slice(-6)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Ngày đặt:{" "}
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                statusColors[
                                  order.status as keyof typeof statusColors
                                ]
                              }`}
                            >
                              {
                                statusMap[
                                  order.status as keyof typeof statusMap
                                ]
                              }
                            </span>
                            {["pending", "processing"].includes(
                              order.status
                            ) && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Hủy đơn
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6 border-b">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-4 py-4 border-b last:border-0"
                          >
                            <div className="relative w-20 h-20">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                              <div className="flex justify-between mt-2">
                                <p className="text-sm text-gray-500">
                                  Số lượng: {item.quantity}
                                </p>
                                <p className="font-medium">
                                  {formatPrice(item.price)}₫
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-6 justify-between">
                          <div>
                            <h4 className="font-medium mb-2">
                              Địa chỉ giao hàng
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">
                              Phương thức thanh toán:{" "}
                              {order.paymentMethod === "COD"
                                ? "Thanh toán khi nhận hàng"
                                : "Thanh toán online"}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Trạng thái thanh toán:{" "}
                              <span
                                className={
                                  order.paymentStatus === "completed"
                                    ? "text-green-600"
                                    : order.paymentStatus === "failed"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }
                              >
                                {order.paymentStatus === "completed"
                                  ? "Đã thanh toán"
                                  : order.paymentStatus === "failed"
                                  ? "Thất bại"
                                  : "Chờ thanh toán"}
                              </span>
                            </p>
                            <p className="font-bold text-xl">
                              Tổng cộng: {formatPrice(order.totalAmount)}₫
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
