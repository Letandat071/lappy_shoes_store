"use client";

import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Doanh thu tháng",
    value: "150.5M",
    change: "+12.5%",
    changeType: "positive",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Đơn hàng mới",
    value: "256",
    change: "+5.2%",
    changeType: "positive",
    icon: ShoppingCartIcon,
  },
  {
    name: "Khách hàng mới",
    value: "125",
    change: "+3.1%",
    changeType: "positive",
    icon: UserGroupIcon,
  },
  {
    name: "Sản phẩm đã bán",
    value: "452",
    change: "+2.5%",
    changeType: "positive",
    icon: ShoppingBagIcon,
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayoutClient>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
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
      </div>
    </AdminLayoutClient>
  );
}
