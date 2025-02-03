"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

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
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (response.ok) {
          const ordersWithProducts = await Promise.all(
            data.orders.map(async (order: Order) => {
              const itemsWithProducts = await Promise.all(
                order.items.map(async (item) => {
                  try {
                    const productResponse = await fetch(
                      `/api/products/${item.product._id}`
                    );
                    if (!productResponse.ok)
                      throw new Error("Failed to fetch product");

                    const productData = await productResponse.json();
                    return {
                      ...item,
                      product: {
                        ...item.product,
                        image: productData.images?.[0]?.url || null,
                        name: productData.name || "Unknown Product",
                        price: productData.price || 0,
                      },
                    };
                  } catch (error) {
                    console.error("Error fetching product:", error);
                    return {
                      ...item,
                      product: {
                        ...item.product,
                        image: null,
                        name: "Unknown Product",
                        price: 0,
                      },
                    };
                  }
                })
              );
              return {
                ...order,
                items: itemsWithProducts,
              };
            })
          );

          const filteredOrders = ordersWithProducts.filter(
            (order) =>
              order.status !== "cancelled" && order.status !== "delivered"
          );

          setOrders(filteredOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            {order.items.map((item, index) => (
              <div key={`${item.product._id}-${index}`} className="flex gap-4">
                <div className="relative w-24 h-24">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name || "Product image"}
                      fill
                      className="object-cover rounded-lg"
                      priority={index < 3}
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-lg">
                      <span className="text-gray-400 text-sm">
                        Đang tải ảnh...
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-bold">${item.product.price}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="font-bold">Total: ${order.total}</span>
              <Link
                href={`/orders/${order.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(RecentOrders), { ssr: false });
