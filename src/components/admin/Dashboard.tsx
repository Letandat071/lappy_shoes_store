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
  // ... other stats
];

export default function AdminDashboard() {
  return (
    <AdminLayoutClient>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>
        {/* Copy phần JSX từ file admin/page.tsx cũ */}
      </div>
    </AdminLayoutClient>
  );
}
