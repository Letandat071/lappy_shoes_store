'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import SearchFilters from '../../components/search/SearchFilters';

// Mock data - trong thực tế sẽ lấy từ API
const mockProducts = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    price: 150,
    originalPrice: 180,
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'Running',
    discount: 15
  },
  {
    id: 2,
    name: 'Nike Air Force 1',
    price: 120,
    originalPrice: 140,
    rating: 4.8,
    reviewCount: 256,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    category: 'Lifestyle',
    discount: 10
  },
  // Thêm nhiều sản phẩm hơn ở đây
];

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Latest', value: 'latest' }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter products based on search query
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
        <nav className="flex text-gray-500 text-sm">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Search Results</span>
        </nav>
      </div>

      {/* Search Results Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Search Results for "{query}"</h1>
            <p className="text-gray-600">{filteredProducts.length} results found</p>
          </div>
          
          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular:</span>
            <Link href="/search?q=Running Shoes" className="text-sm text-gray-600 hover:text-black">
              Running Shoes
            </Link>
            <Link href="/search?q=Basketball" className="text-sm text-gray-600 hover:text-black">
              Basketball
            </Link>
            <Link href="/search?q=Lifestyle" className="text-sm text-gray-600 hover:text-black">
              Lifestyle
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <SearchFilters />

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Sort by:</span>
                <select 
                  className="border-0 focus:ring-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`p-2 rounded-lg hover:bg-gray-100 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`p-2 rounded-lg hover:bg-gray-100 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className={`grid gap-6 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8 gap-2">
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="px-4 py-2 border rounded-lg bg-black text-white">1</button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">2</button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">3</button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </>
            ) : (
              /* No Results State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-search text-4xl text-gray-400"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
                <p className="text-gray-600 mb-8">
                  Try checking your spelling or using different keywords
                </p>
                <button 
                  onClick={() => window.history.back()}
                  className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 