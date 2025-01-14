'use client';

import React from 'react';

type FilterValue = string | number | string[] | { min: number; max: number };

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  sizes: string[];
  colors: string[];
  [key: string]: FilterValue | FilterValue[];
}

interface FilterSidebarProps {
  selectedFilters: Filters;
  onFilterChange: (filterType: string, value: FilterValue) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ selectedFilters, onFilterChange }) => {
  const handlePriceChange = (value: number) => {
    onFilterChange('priceRange', { min: 0, max: value });
  };

  const handleColorSelect = (color: string) => {
    onFilterChange('colors', color);
  };

  const handleSizeSelect = (size: string) => {
    onFilterChange('sizes', size);
  };

  const handleBrandSelect = (brand: string) => {
    onFilterChange('brands', brand);
  };

  const handleCategorySelect = (category: string) => {
    onFilterChange('categories', category);
  };

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={() => onFilterChange('clear', '')}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={selectedFilters.priceRange.max}
            className="w-full"
            onChange={(e) => handlePriceChange(Number(e.target.value))}
          />
          <div className="flex justify-between mt-2">
            <span>${selectedFilters.priceRange.min}</span>
            <span>${selectedFilters.priceRange.max}</span>
          </div>
        </div>

        {/* Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {['red', 'blue', 'green', 'yellow', 'black', 'white'].map(
              (color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedFilters.colors.includes(color)
                      ? 'border-black'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              )
            )}
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Sizes</h3>
          <div className="grid grid-cols-4 gap-2">
            {['36', '37', '38', '39', '40', '41', '42', '43'].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`px-3 py-2 border rounded ${
                  selectedFilters.sizes.includes(size)
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Brands</h3>
          <div className="space-y-2">
            {['Nike', 'Adidas', 'Puma', 'New Balance'].map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedFilters.brands.includes(brand)
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {[
              'Running',
              'Basketball',
              'Training',
              'Lifestyle',
              'Soccer',
              'Tennis'
            ].map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedFilters.categories.includes(category)
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category}</span>
                  {selectedFilters.categories.includes(category) && (
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar; 