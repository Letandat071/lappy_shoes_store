import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CheckoutFailed = () => {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
              <i className="fas fa-times text-red-600 text-4xl"></i>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Thanh toán thất bại
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Link
              href="/checkout"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Thử lại
            </Link>
            <Link
              href="/cart"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default CheckoutFailed; 