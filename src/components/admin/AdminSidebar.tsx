"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  TagIcon,
  PhotoIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: HomeIcon },
  {
    name: "Sản phẩm",
    href: "/admin/dashboard/products",
    icon: ShoppingBagIcon,
  },
  {
    name: "Đơn hàng",
    href: "/admin/dashboard/orders",
    icon: ClipboardDocumentListIcon,
  },
  { name: "Khách hàng", href: "/admin/dashboard/users", icon: UsersIcon },
  { name: "Danh mục", href: "/admin/dashboard/categories", icon: TagIcon },
  { name: "Banner", href: "/admin/dashboard/banner", icon: PhotoIcon },
  {
    name: "Thông báo",
    href: "/admin/dashboard/announcements",
    icon: MegaphoneIcon,
  },
  { name: "Features", href: "/admin/dashboard/features", icon: ChartBarIcon },
  { name: "Cài đặt", href: "/admin/dashboard/settings", icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Lappy Shoes Admin
            </Link>
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <item.icon
                    className={`${
                      isActive
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 h-6 w-6 flex-shrink-0`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
