"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProfileSidebar = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src="https://i.pravatar.cc/100?img=1"
            alt="User avatar"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-gray-600">john.doe@example.com</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </Link>
        <Link href="/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-box"></i>
          <span>Orders</span>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-heart"></i>
          <span>Wishlist</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-red-500 w-full">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar; 