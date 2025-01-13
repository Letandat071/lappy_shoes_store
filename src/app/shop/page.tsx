'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSidebar from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';

const products = [
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
  // Add more products...
];

type FilterValue = string | number | string[] | { min: number; max: number };

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  sizes: string[];
  colors: string[];
  [key: string]: FilterValue | FilterValue[]; // Updated index signature
}

export default function ShopPage() {
  const [selectedFilters, setSelectedFilters] = React.useState<Filters>({
    categories: [],
    priceRange: { min: 0, max: 500 },
    brands: [],
    sizes: [],
    colors: []
  });

  const handleFilterChange = (filterType: string, value: FilterValue) => {
    if (filterType === 'clear') {
      setSelectedFilters({
        categories: [],
        priceRange: { min: 0, max: 500 },
        brands: [],
        sizes: [],
        colors: []
      });
      return;
    }

    setSelectedFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const array = prev[filterType] as string[];
        const valueStr = value as string;
        const index = array.indexOf(valueStr);
        if (index === -1) {
          return { ...prev, [filterType]: [...array, valueStr] };
        }
        return { ...prev, [filterType]: array.filter(item => item !== valueStr) };
      }
      return { ...prev, [filterType]: value };
    });
  };

  return (
    <main>
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
        <nav className="flex text-gray-500 text-sm">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Shop</span>
        </nav>
      </div>

      {/* Search Results Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-gray-600">{products.length} results found</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black pr-12"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black">
              <i className="fas fa-search text-lg"></i>
            </button>
          </div>

          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular:</span>
            <Link href="/search?q=Running%20Shoes" className="text-sm text-gray-600 hover:text-black">
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
          {/* Filters Sidebar */}
          <FilterSidebar 
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Results Grid */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Sort by:</span>
                <select className="border-0 focus:ring-0">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Latest</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <i className="fas fa-th-large"></i>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
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
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 