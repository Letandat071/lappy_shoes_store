import React from 'react';
import Link from 'next/link';

const MissionSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Our Mission</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          We&apos;re dedicated to providing the best footwear experience, combining style, comfort, and sustainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quality Products */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Quality Products</h3>
            <p className="text-gray-600 mb-4">
              We source the highest quality materials and partner with skilled artisans to create footwear that&apos;s built to last.
            </p>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn More
            </Link>
          </div>

          {/* Customer First */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Customer First</h3>
            <p className="text-gray-600 mb-4">
              Our commitment to exceptional service means we&apos;re always here to help you find the perfect fit.
            </p>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn More
            </Link>
          </div>

          {/* Sustainability */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Sustainability</h3>
            <p className="text-gray-600 mb-4">
              We&apos;re actively working to reduce our environmental impact through eco-friendly materials and practices.
            </p>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection; 