import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[800px] pt-16 md:pt-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c"
          alt="Hero background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-3xl">
          <span className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm mb-6">
            New Season Arrived
          </span>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
            Discover Your Perfect Style
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-8">
            Explore our latest collection of premium footwear. From casual comfort to
            athletic performance, find the perfect pair for every occasion.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2">2k+</h3>
            <p className="text-gray-300">Products</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2">8k+</h3>
            <p className="text-gray-300">Customers</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2">99%</h3>
            <p className="text-gray-300">Satisfaction</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2">4.8</h3>
            <p className="text-gray-300">Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 