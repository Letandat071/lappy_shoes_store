"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Mật khẩu xác nhận không khớp',
        icon: 'error',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#000'
      });
      setLoading(false);
      return;
    }

    try {
      await register(formData.fullName, formData.email, formData.password);
      
      // Hiển thị thông báo thành công
      await Swal.fire({
        title: 'Đăng ký thành công!',
        text: 'Vui lòng đăng nhập để tiếp tục',
        icon: 'success',
        confirmButtonText: 'Đăng nhập ngay',
        confirmButtonColor: '#000'
      });

      // Chuyển về form login và reset form
      router.push('/auth?tab=login');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Lỗi!',
        text: err instanceof Error ? err.message : 'Đã có lỗi xảy ra',
        icon: 'error',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Họ và tên
        </label>
        <div className="mt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="far fa-user text-gray-400"></i>
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="far fa-envelope text-gray-400"></i>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <div className="mt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-lock text-gray-400"></i>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
              required
              minLength={8}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Xác nhận mật khẩu
        </label>
        <div className="mt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-lock text-gray-400"></i>
            </div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          required
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
          Tôi đồng ý với{' '}
          <a href="/terms" className="text-black hover:underline">
            Điều khoản sử dụng
          </a>{' '}
          và{' '}
          <a href="/privacy" className="text-black hover:underline">
            Chính sách bảo mật
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:bg-gray-400"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tạo tài khoản...
          </>
        ) : (
          'Tạo tài khoản'
        )}
      </button>
    </form>
  );
};

export default SignUpForm; 