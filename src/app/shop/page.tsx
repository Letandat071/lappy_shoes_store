'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSidebar from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductSkeleton from '@/components/shop/ProductSkeleton';

type FilterValue = string | number | string[] | { min: number; max: number };

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  sizes: string[];
  colors: string[];
  sort: string;
  feature: string;
  audience: string;
  [key: string]: FilterValue | FilterValue[];
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedFilters, setSelectedFilters] = React.useState<Filters>({
    categories: [],
    priceRange: { min: 0, max: 10000000 },
    brands: [],
    sizes: [],
    colors: [],
    sort: '-createdAt',
    feature: '',
    audience: ''
  });

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');

  // Update filters when URL changes
  React.useEffect(() => {
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const brand = searchParams.get('brand');
    const feature = searchParams.get('feature');
    const audience = searchParams.get('audience');

    // Reset filters first
    setSelectedFilters(prev => ({
      ...prev,
      categories: [],
      brands: [],
      feature: '',
      audience: ''
    }));

    // Then apply new filters from URL
    if (category) {
      setSelectedFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }

    if (searchQuery) {
      setSearch(searchQuery);
    }

    if (brand) {
      setSelectedFilters(prev => ({
        ...prev,
        brands: [brand]
      }));
    }

    if (feature) {
      setSelectedFilters(prev => ({
        ...prev,
        feature
      }));
    }

    if (audience) {
      setSelectedFilters(prev => ({
        ...prev,
        audience
      }));
    }

    // Reset page when filters change
    setPage(1);
  }, [searchParams]); // Re-run when searchParams changes

  const { products, loading, error, pagination } = useProducts({
    page,
    limit: 12,
    category: selectedFilters.categories[0],
    minPrice: selectedFilters.priceRange.min > 0 ? selectedFilters.priceRange.min : undefined,
    maxPrice: selectedFilters.priceRange.max < 10000000 ? selectedFilters.priceRange.max : undefined,
    search,
    sort: selectedFilters.sort,
    brands: selectedFilters.brands,
    sizes: selectedFilters.sizes,
    colors: selectedFilters.colors,
    feature: selectedFilters.feature,
    audience: selectedFilters.audience
  });

  console.log("Shop page - Filters:", {
    page,
    limit: 12,
    category: selectedFilters.categories[0],
    minPrice: selectedFilters.priceRange.min,
    maxPrice: selectedFilters.priceRange.max,
    search,
    sort: selectedFilters.sort,
    brands: selectedFilters.brands,
    sizes: selectedFilters.sizes,
    colors: selectedFilters.colors,
    feature: selectedFilters.feature,
    audience: selectedFilters.audience
  });

  console.log("Shop page - Products:", products);
  console.log("Shop page - Pagination:", pagination);
  console.log("Shop page - Loading:", loading);
  console.log("Shop page - Error:", error);

  const handleFilterChange = (filterType: string, value: FilterValue) => {
    if (filterType === 'clear') {
      setSelectedFilters({
        categories: [],
        priceRange: { min: 0, max: 10000000 },
        brands: [],
        sizes: [],
        colors: [],
        sort: '-createdAt',
        feature: '',
        audience: ''
      });
      setPage(1);
      return;
    }

    if (filterType === 'sort') {
      setSelectedFilters(prev => ({ ...prev, sort: value as string }));
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
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.querySelector('input') as HTMLInputElement;
    setSearch(searchInput.value);
    setPage(1);
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
            {pagination && (
              <p className="text-gray-600">{pagination.total} results found</p>
            )}
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input 
              type="text"
              placeholder="Search products..."
              defaultValue={search}
              className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black pr-12"
            />
            <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black">
              <i className="fas fa-search text-lg"></i>
            </button>
          </form>

          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular:</span>
            <button 
              onClick={() => setSearch('Running Shoes')}
              className="text-sm text-gray-600 hover:text-black"
            >
              Running Shoes
            </button>
            <button 
              onClick={() => setSearch('Basketball')}
              className="text-sm text-gray-600 hover:text-black"
            >
              Basketball
            </button>
            <button 
              onClick={() => setSearch('Lifestyle')}
              className="text-sm text-gray-600 hover:text-black"
            >
              Lifestyle
            </button>
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
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4">Lỗi Khi tải sản phẩm</h2>
                <p className="text-gray-600 mb-8">Có thể sản phẩm của bạn không tồn tại hoặc đã bị xóa</p>
                {/* <p className="text-gray-600 mb-8">{error}</p> */}
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      rating={product.rating || 0}
                      reviewCount={product.reviewCount || 0}
                      image={product.images[0]?.url || ''}
                      category={product.category.name}
                      discount={product.discount}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button 
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 border rounded-lg ${
                          page === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 