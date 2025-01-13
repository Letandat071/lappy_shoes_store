"use client";

import React from 'react';
import Link from 'next/link';

const ProfileSidebar = () => {
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <img 
            src="https://ui-avatars.com/api/?name=John+Doe" 
            alt="Profile" 
            className="w-24 h-24 rounded-full mb-4"
          />
          <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800">
            <i className="fas fa-camera"></i>
          </button>
        </div>
        <h2 className="text-xl font-bold">John Doe</h2>
        <p className="text-gray-600">john@example.com</p>
      </div>

      <nav className="space-y-2">
        <Link 
          href="#profile" 
          className="flex items-center gap-3 text-gray-700 hover:text-black p-3 rounded-lg bg-gray-100"
        >
          <i className="fas fa-user-circle w-5"></i>
          <span>Profile Information</span>
        </Link>
        <Link 
          href="#orders" 
          className="flex items-center gap-3 text-gray-700 hover:text-black p-3 rounded-lg hover:bg-gray-100"
        >
          <i className="fas fa-box w-5"></i>
          <span>Order History</span>
        </Link>
        <Link 
          href="#addresses" 
          className="flex items-center gap-3 text-gray-700 hover:text-black p-3 rounded-lg hover:bg-gray-100"
        >
          <i className="fas fa-map-marker-alt w-5"></i>
          <span>Addresses</span>
        </Link>
        <Link 
          href="#payment" 
          className="flex items-center gap-3 text-gray-700 hover:text-black p-3 rounded-lg hover:bg-gray-100"
        >
          <i className="fas fa-credit-card w-5"></i>
          <span>Payment Methods</span>
        </Link>
        <Link 
          href="#settings" 
          className="flex items-center gap-3 text-gray-700 hover:text-black p-3 rounded-lg hover:bg-gray-100"
        >
          <i className="fas fa-cog w-5"></i>
          <span>Settings</span>
        </Link>
      </nav>

      <hr className="my-6" />

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-600 hover:text-red-700 p-3 w-full"
      >
        <i className="fas fa-sign-out-alt w-5"></i>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileSidebar; 