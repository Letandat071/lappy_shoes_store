"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface User {
  name: string;
  email: string;
  avatar: string;
}

const ProfileSidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          setUser({
            name: data.user.name || '',
            email: data.user.email || '',
            avatar: data.user.avatar || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận đăng xuất?',
        text: "Bạn có chắc chắn muốn đăng xuất?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const response = await fetch('/api/auth/logout', {
          method: 'POST'
        });

        if (response.ok) {
          Swal.fire({
            title: 'Đã đăng xuất!',
            text: 'Đăng xuất thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          router.push('/auth');
        }
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể đăng xuất. Vui lòng thử lại',
        confirmButtonColor: '#000'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt="User avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-user"></i>
          <span>Thông tin cá nhân</span>
        </Link>
        <Link href="/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-box"></i>
          <span>Đơn hàng</span>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-heart"></i>
          <span>Yêu thích</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-cog"></i>
          <span>Cài đặt</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-red-500 w-full"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar; 