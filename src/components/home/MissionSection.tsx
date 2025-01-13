import React from 'react';
import Link from 'next/link';

const MissionSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We&apos;re dedicated to providing the best footwear experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-primary-600 mb-4">
              <i className="fas fa-shoe-prints text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-4">Quality Products</h3>
            <p className="text-gray-600 mb-6">
              We source only the highest quality materials and partner with renowned manufacturers to ensure every pair meets our standards.
            </p>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn More <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-primary-600 mb-4">
              <i className="fas fa-users text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-4">Customer First</h3>
            <p className="text-gray-600 mb-6">
              Our dedicated team is committed to providing exceptional service and ensuring your complete satisfaction.
            </p>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn More <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-primary-600 mb-4">
              <i className="fas fa-leaf text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-4">Sustainability</h3>
            <p className="text-gray-600 mb-6">
              We&apos;re committed to reducing our environmental impact through sustainable practices and eco-friendly materials.
            </p>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn More <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection; 