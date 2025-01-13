"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';

interface Category {
  title: string;
  description: string;
  banner: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  discount: number;
}

interface FeaturedContentProps {
  categories: Record<string, Category>;
  products: Product[];
}

const FeaturedContent = ({ categories, products }: FeaturedContentProps) => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'new-releases';
  const categoryInfo = categories[category as keyof typeof categories];

  return (
    <main className="pt-32">
      {/* Category Banner */}
      <div 
        className="h-[300px] relative mb-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${categoryInfo.banner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">{categoryInfo.title}</h1>
            <p className="text-lg">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex overflow-x-auto gap-4 pb-4">
          {Object.entries(categories).map(([key, value]) => (
            <Link
              key={key}
              href={`/featured?category=${key}`}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-colors
                ${category === key 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {value.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default FeaturedContent; 