import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CheckoutFailedPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-exclamation">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500"></i>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8">
            We're sorry, but there was an issue processing your payment. Please try again or use a different payment method.
          </p>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="font-bold mb-4">Common Issues</h2>
            <ul className="space-y-2 text-sm text-gray-600 text-left">
              <li className="flex items-center gap-2">
                <i className="fas fa-circle text-xs"></i>
                Insufficient funds in your account
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-circle text-xs"></i>
                Incorrect card information
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-circle text-xs"></i>
                Card expired or blocked
              </li>
            </ul>
          </div>

          <div className="space-x-4">
            <Link 
              href="/checkout" 
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 inline-block"
            >
              Try Again
            </Link>
            <Link 
              href="/support" 
              className="text-gray-600 hover:text-black inline-flex items-center"
            >
              <i className="fas fa-headset mr-2"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutFailedPage; 