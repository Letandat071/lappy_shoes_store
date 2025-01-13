import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturedContent from '@/components/featured/FeaturedContent';

const categories = {
  'new-releases': {
    title: 'New Releases',
    description: 'The latest and greatest in sneaker innovation',
    banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
  },
  'best-sellers': {
    title: 'Best Sellers',
    description: 'Our most popular sneakers loved by customers',
    banner: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519'
  },
  'limited-edition': {
    title: 'Limited Edition',
    description: 'Exclusive sneakers in limited quantities',
    banner: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'
  },
  'collections': {
    title: 'Collections',
    description: 'Curated collections for every style',
    banner: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'
  },
  'summer-2023': {
    title: 'Summer 2023',
    description: 'Fresh styles for the summer season',
    banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
  },
  'sport-elite': {
    title: 'Sport Elite',
    description: 'Performance sneakers for athletes',
    banner: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519'
  },
  'classics': {
    title: 'Classics',
    description: 'Timeless sneakers that never go out of style',
    banner: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'
  }
};

const mockProducts = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    category: 'Running Collection',
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    discount: 20
  },
];

const FeaturedPage = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="pt-32 max-w-7xl mx-auto px-4">
          <div className="h-[300px] bg-gray-200 animate-pulse mb-12 rounded-lg" />
          <div className="flex gap-4 mb-12">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 animate-pulse rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,8].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      }>
        <FeaturedContent categories={categories} products={mockProducts} />
      </Suspense>
      <Footer />
    </>
  );
};

export default FeaturedPage; 