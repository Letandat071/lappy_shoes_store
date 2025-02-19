"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import UserAvatar from '@/components/common/UserAvatar';

const menuItems = [
  {
    label: 'Thông tin cá nhân',
    href: '/profile',
    icon: 'fas fa-user'
  },
  {
    label: 'Đơn hàng của tôi',
    href: '/orders',
    icon: 'fas fa-shopping-bag'
  },
  {
    label: 'Địa chỉ',
    href: '/addresses',
    icon: 'fas fa-map-marker-alt'
  },
  {
    label: 'Yêu thích',
    href: '/wishlist',
    icon: 'fas fa-heart'
  },
  {
    label: 'Đổi mật khẩu',
    href: '/change-password',
    icon: 'fas fa-lock'
  }
];

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-6">
        <UserAvatar 
          name={user.name || ''} 
          image={user.image || ''} 
          size={48}
        />
        <div>
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 