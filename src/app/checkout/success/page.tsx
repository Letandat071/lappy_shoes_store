import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CheckoutSuccessPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-checkmark">
            <i className="fas fa-check text-4xl text-green-500"></i>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order #12345 has been confirmed and will be shipped soon.
          </p>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="font-bold mb-4">Order Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Order Number: #12345</p>
              <p>Order Date: November 8, 2023</p>
              <p>Estimated Delivery: November 15-18, 2023</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              href="/" 
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 inline-block"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/orders" 
              className="text-gray-600 hover:text-black inline-flex items-center"
            >
              <i className="fas fa-file-alt mr-2"></i>
              View Order Details
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutSuccessPage; 