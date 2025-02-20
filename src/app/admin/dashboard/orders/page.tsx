"use client";

import { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/utils/format";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string | null;
    price: number;
  };
  quantity: number;
  size: string;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Thêm interface cho modal
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    status: string,
    type: "order" | "payment"
  ) => void;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipped", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedStatus) queryParams.append("status", selectedStatus);
      if (searchTerm) queryParams.append("search", searchTerm);

      const response = await fetch(`/api/admin/orders?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        // Fetch product details for each order
        const ordersWithProducts = await Promise.all(
          data.orders.map(async (order: Order) => {
            const itemsWithProducts = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productResponse = await fetch(
                    `/api/products/${item.product._id}`,
                    {
                      headers: {
                        'x-admin-request': 'true'
                      }
                    }
                  );
                  if (!productResponse.ok) {
                    const errorData = await productResponse.json();
                    throw new Error(`Failed to fetch product: ${errorData.error || productResponse.statusText}`);
                  }

                  const productData = await productResponse.json();

                  // Kiểm tra null và xử lý lỗi
                  if (!productData || !productData.product) {
                    console.error("Invalid product data received:", productData);
                    console.error("Product ID:", item.product._id);
                    return {
                      ...item,
                      product: {
                        ...item.product,
                        image: null,
                        name: `Unknown Product (${item.product._id})`,
                        price: 0,
                      },
                    };
                  }

                  return {
                    ...item,
                    product: {
                      ...item.product,
                      image: productData.product?.images?.[0]?.url || null,
                      name: productData.product?.name || "Unknown Product",
                      price: productData.product?.price || 0,
                    },
                  };
                } catch (error) {
                  console.error("Error fetching product:", error);
                  return item;
                }
              })
            );
            return {
              ...order,
              items: itemsWithProducts,
            };
          })
        );

        setOrders(ordersWithProducts);
        setPagination(data.pagination);
      } else {
        console.error("Error fetching orders:", data.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: string,
    type: "order" | "payment" = "order"
  ) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          type,
        }),
      });

      if (response.ok) {
        toast.success(
          `Cập nhật ${
            type === "order" ? "trạng thái" : "thanh toán"
          } thành công`
        );
        fetchOrders();
      } else {
        const data = await response.json();
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  // Component Modal chi tiết đơn hàng
  const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    onClose,
    onUpdateStatus,
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Đơn hàng #{order._id.slice(-6)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Đặt ngày{" "}
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <i className="fas fa-times text-xl text-gray-500"></i>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fas fa-user-circle text-gray-400 text-xl"></i>
                  <h3 className="text-lg font-semibold">
                    Thông tin khách hàng
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium">
                      {order.shippingAddress.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fas fa-clipboard-list text-gray-400 text-xl"></i>
                  <h3 className="text-lg font-semibold">Trạng thái đơn hàng</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Trạng thái đơn hàng
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateStatus(order._id, e.target.value, "order")
                      }
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {statusOptions
                        .filter((opt) => opt.value)
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Trạng thái thanh toán
                    </p>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        onUpdateStatus(order._id, e.target.value, "payment")
                      }
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="pending">Chờ thanh toán</option>
                      <option value="completed">Đã thanh toán</option>
                      <option value="failed">Thất bại</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Phương thức thanh toán
                    </p>
                    <p className="font-medium capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-shopping-bag text-gray-400 text-xl"></i>
                <h3 className="text-lg font-semibold">Chi tiết sản phẩm</h3>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Đơn giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-image text-gray-400"></i>
                              </div>
                            )}
                            <span className="ml-4 font-medium">
                              {item.product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{item.size}</td>
                        <td className="px-6 py-4 text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm">
                          {formatPrice(item.product.price)}₫
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {formatPrice(item.product.price * item.quantity)}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 p-6 rounded-xl border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <i className="fas fa-receipt text-gray-400 text-xl"></i>
                  <span className="text-lg font-semibold">Tổng thanh toán</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(order.totalAmount)}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>

        <div className="flex gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Tìm theo tên/SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          {/* Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <p className="font-medium">
                        {order.shippingAddress.fullName}
                      </p>
                      <p>{order.shippingAddress.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.totalAmount)}₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="text-sm border rounded p-1"
                    >
                      {statusOptions
                        .filter((opt) => opt.value)
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value, "payment")
                      }
                      className={`text-sm border rounded-lg px-2 py-1 w-32
                        ${
                          order.paymentStatus === "completed"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : order.paymentStatus === "failed"
                            ? "bg-red-50 text-red-800 border-red-200"
                            : "bg-yellow-50 text-yellow-800 border-yellow-200"
                        }`}
                    >
                      <option
                        value="pending"
                        className="bg-white text-gray-800"
                      >
                        Chờ thanh toán
                      </option>
                      <option
                        value="completed"
                        className="bg-white text-gray-800"
                      >
                        Đã thanh toán
                      </option>
                      <option value="failed" className="bg-white text-gray-800">
                        Thất bại
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Hiển thị {orders.length} / {pagination.total} đơn hàng
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Trước
          </button>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}
