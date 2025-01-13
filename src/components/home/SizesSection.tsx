import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SizesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Find Your Perfect Fit</h2>
            <p className="text-gray-600 mb-8">
              We understand that finding the right size is crucial for comfort and performance.
              Our comprehensive size guide helps you make the perfect choice every time.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-ruler text-primary-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Accurate Measurements</h3>
                  <p className="text-gray-600">
                    Detailed size charts and measuring guides for precise fitting.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-exchange-alt text-primary-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy Returns</h3>
                  <p className="text-gray-600">
                    Free size exchanges within 30 days of purchase.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-comments text-primary-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Expert Assistance</h3>
                  <p className="text-gray-600">
                    Our team is here to help you find your perfect size.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/size-guide"
              className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              View Size Guide
            </Link>
          </div>

          <div className="relative h-[500px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d"
              alt="Size guide"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizesSection; 