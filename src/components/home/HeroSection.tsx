import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 min-h-[600px] md:min-h-[800px] flex items-center overflow-hidden pt-16 md:pt-0">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-repeat bg-center hero-pattern"></div>
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>
      
      {/* Moving particles effect */}
      <div className="absolute inset-0" id="particles-js"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 py-8 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <span className="inline-block text-yellow-400 text-sm md:text-lg font-medium bg-yellow-400/10 px-3 py-1 md:px-4 md:py-2 rounded-full">
                New Season Arrived
              </span>
              <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                <span className="block text-glow">Elevate Your</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-gradient">
                  Style Game
                </span>
              </h1>
              <p className="text-base md:text-xl text-gray-300 leading-relaxed">
                Discover our latest collection of premium sneakers that combine 
                <span className="text-yellow-400"> style</span>, 
                <span className="text-blue-400"> comfort</span>, and 
                <span className="text-green-400"> performance</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link 
                href="/shop"
                className="group relative hero-shine bg-white hover:bg-yellow-400 text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 hover:shadow-xl text-sm md:text-base"
              >
                Shop Collection
                <span className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </Link>
              <button className="relative overflow-hidden border-2 border-white hover:bg-white hover:text-black text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 text-sm md:text-base">
                <span className="relative z-10">Watch Video</span>
                <i className="fas fa-play ml-2"></i>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8">
              <div className="text-center">
                <h4 className="text-2xl md:text-4xl font-bold text-glow">50+</h4>
                <p className="text-gray-400 text-sm md:text-base">Premium Brands</p>
              </div>
              <div className="text-center">
                <h4 className="text-2xl md:text-4xl font-bold text-glow">200+</h4>
                <p className="text-gray-400 text-sm md:text-base">Retail Shops</p>
              </div>
              <div className="text-center">
                <h4 className="text-2xl md:text-4xl font-bold text-glow">30k+</h4>
                <p className="text-gray-400 text-sm md:text-base">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hidden on mobile, shown from large screens */}
          <div className="relative hidden lg:block">
            {/* Glowing effects */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400 rounded-full filter blur-[100px] opacity-50 floating"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600 rounded-full filter blur-[100px] opacity-50 floating-delay"></div>
            
            {/* Main product image */}
            <div className="relative h-[600px] w-full group">
              <Image 
                id="mainProductImage" 
                src="https://www.pngall.com/wp-content/uploads/13/Nike-Shoes-PNG-Pic.png" 
                alt="Featured Shoe" 
                className="w-full h-full object-contain transform transition-all duration-500 
                group-hover:scale-110 group-hover:rotate-6 hover:cursor-pointer floating"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                priority
              />
              
              {/* Product Features */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 space-y-4">
                <div className="product-feature bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-feather text-black"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Ultra Light</h4>
                      <p className="text-gray-300 text-sm">Feather-light design</p>
                    </div>
                  </div>
                </div>
                <div className="product-feature bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-wind text-black"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Breathable</h4>
                      <p className="text-gray-300 text-sm">Advanced airflow</p>
                    </div>
                  </div>
                </div>
                <div className="product-feature bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-shoe-prints text-black"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Perfect Fit</h4>
                      <p className="text-gray-300 text-sm">Adaptive comfort</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 