'use client';

import React from 'react';
import { useRouter } from 'next/router';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  sizes: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<FilterState>({
    priceRange: [0, 500],
    categories: [],
    brands: [],
    sizes: []
  });

  // Categories
  const categories = [
    'Running',
    'Basketball',
    'Training',
    'Casual',
    'Outdoor'
  ];

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    const newFilters = {
      ...filters,
      categories: newCategories
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Brands
  const brands = [
    'Nike',
    'Adidas',
    'Puma',
    'New Balance',
    'Under Armour'
  ];

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];

    const newFilters = {
      ...filters,
      brands: newBrands
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Sizes
  const sizes = [
    'US 7',
    'US 8',
    'US 9',
    'US 10',
    'US 11'
  ];

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];

    const newFilters = {
      ...filters,
      sizes: newSizes
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Price Range
  const handlePriceChange = (value: [number, number]) => {
    const newFilters = {
      ...filters,
      priceRange: value
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 500],
      categories: [],
      brands: [],
      sizes: []
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-4">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-semibold mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label
              key={size}
              className={`text-center border-2 rounded-lg py-2 cursor-pointer transition-colors ${
                filters.sizes.includes(size)
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                className="sr-only"
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <div className="flex justify-between mb-2">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange([filters.priceRange[0], Number(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={handleClearFilters}
        className="w-full py-2 text-gray-600 hover:text-black"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar; 