import React from 'react';
import Link from 'next/link';

const QuickLinks = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-truck text-black text-2xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-4">Shipping & Delivery</h3>
            <p className="text-gray-600 mb-4">Track your order and learn about our shipping policies</p>
            <Link href="#" className="text-black font-medium hover:underline">Learn More →</Link>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-exchange-alt text-black text-2xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-4">Returns & Exchanges</h3>
            <p className="text-gray-600 mb-4">Easy returns within 30 days of purchase</p>
            <Link href="#" className="text-black font-medium hover:underline">Learn More →</Link>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-credit-card text-black text-2xl"></i>
            </div>
            <h3 className="font-bold text-xl mb-4">Payment & Pricing</h3>
            <p className="text-gray-600 mb-4">Information about payment methods and pricing</p>
            <Link href="#" className="text-black font-medium hover:underline">Learn More →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickLinks; 