"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { formatPrice } from "@/utils/format";
import { toast } from "react-hot-toast";

interface DashboardStats {
  monthlyRevenue: number;
  newOrders: number;
  newCustomers: number;
  soldProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  } | null;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_MAP = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

const STATUS_STYLES = {
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  default: 'bg-yellow-100 text-yellow-800'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/dashboard', {
            headers: {
              'x-admin-request': 'true'
            }
          }),
          fetch('/api/admin/orders?limit=5', {
            headers: {
              'x-admin-request': 'true'
            }
          })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.orders || []);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchDashboardData();
    }
  }, [mounted]);

  const statsItems = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        name: "Doanh thu tháng",
        value: formatPrice(stats.monthlyRevenue || 0),
        change: `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange || 0}%`,
        changeType: (stats.revenueChange || 0) >= 0 ? "positive" : "negative",
        icon: CurrencyDollarIcon,
      },
      {
        name: "Đơn hàng mới",
        value: (stats.newOrders || 0).toString(),
        change: `${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange || 0}%`,
        changeType: (stats.ordersChange || 0) >= 0 ? "positive" : "negative",
        icon: ShoppingCartIcon,
      },
      {
        name: "Khách hàng mới",
        value: (stats.newCustomers || 0).toString(),
        change: `${stats.customersChange > 0 ? '+' : ''}${stats.customersChange || 0}%`,
        changeType: (stats.customersChange || 0) >= 0 ? "positive" : "negative",
        icon: UserGroupIcon,
      },
      {
        name: "Sản phẩm đã bán",
        value: (stats.soldProducts || 0).toString(),
        change: `${stats.productsChange > 0 ? '+' : ''}${stats.productsChange || 0}%`,
        changeType: (stats.productsChange || 0) >= 0 ? "positive" : "negative",
        icon: ShoppingBagIcon,
      },
    ];
  }, [stats]);

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsItems.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Đơn hàng gần đây</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
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
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(!recentOrders || recentOrders.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || "Không có tên"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(order.totalAmount || 0)}₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        STATUS_STYLES[order.status as keyof typeof STATUS_STYLES] || STATUS_STYLES.default
                      }`}>
                        {STATUS_MAP[order.status as keyof typeof STATUS_MAP] || order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
