'use client'

import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturedContent from '@/components/featured/FeaturedContent';

const FeaturedPage = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="pt-32 max-w-7xl mx-auto px-4">
          <div className="h-[300px] bg-gray-200 animate-pulse mb-12 rounded-lg" />
          <div className="flex gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 animate-pulse rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 8].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      }>
        <FeaturedContent />
      </Suspense>
      <Footer />
    </>
  );
};

export default FeaturedPage; 