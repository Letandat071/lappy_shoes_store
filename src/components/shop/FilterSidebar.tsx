'use client';

import React from 'react';

interface FilterSidebarProps {
  onFilterChange: (filterType: string, value: any) => void;
  selectedFilters: {
    categories: string[];
    priceRange: { min: number; max: number };
    brands: string[];
    sizes: string[];
    colors: string[];
  };
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  selectedFilters
}) => {
  return (
    <div className="lg:w-1/4 space-y-6">
      {/* Categories Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {['Running', 'Basketball', 'Lifestyle'].map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="form-checkbox"
                checked={selectedFilters.categories.includes(category)}
                onChange={(e) => onFilterChange('categories', category)}
              />
              {category} (12)
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <input 
            type="range" 
            min="0" 
            max="500" 
            className="w-full price-slider"
            value={selectedFilters.priceRange.max}
            onChange={(e) => onFilterChange('priceRange', { 
              ...selectedFilters.priceRange, 
              max: parseInt(e.target.value) 
            })}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>$500</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-1/2 px-3 py-1 border rounded-lg"
              value={selectedFilters.priceRange.min}
              onChange={(e) => onFilterChange('priceRange', { 
                ...selectedFilters.priceRange, 
                min: parseInt(e.target.value) 
              })}
            />
            <input 
              type="number" 
              placeholder="Max" 
              className="w-1/2 px-3 py-1 border rounded-lg"
              value={selectedFilters.priceRange.max}
              onChange={(e) => onFilterChange('priceRange', { 
                ...selectedFilters.priceRange, 
                max: parseInt(e.target.value) 
              })}
            />
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Brand</h3>
        <div className="space-y-2">
          {['Nike', 'Adidas', 'Puma'].map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="form-checkbox"
                checked={selectedFilters.brands.includes(brand)}
                onChange={(e) => onFilterChange('brands', brand)}
              />
              {brand} (15)
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {['US 7', 'US 8', 'US 9', 'US 10', 'US 11'].map((size) => (
            <label 
              key={size}
              className={`text-center border rounded-lg py-2 cursor-pointer hover:border-black ${
                selectedFilters.sizes.includes(size) ? 'bg-black text-white' : ''
              }`}
            >
              <input 
                type="checkbox"
                className="hidden"
                checked={selectedFilters.sizes.includes(size)}
                onChange={(e) => onFilterChange('sizes', size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Color</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Black', value: 'bg-black' },
            { name: 'White', value: 'bg-white' },
            { name: 'Red', value: 'bg-red-500' },
            { name: 'Blue', value: 'bg-blue-500' }
          ].map((color) => (
            <div 
              key={color.name}
              className={`w-8 h-8 rounded-full ${color.value} border-2 cursor-pointer hover:scale-110 transition-transform ${
                selectedFilters.colors.includes(color.name) ? 'border-black scale-110' : 'border-gray-200'
              }`}
              onClick={() => onFilterChange('colors', color.name)}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button 
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        onClick={() => onFilterChange('clear', null)}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar; 