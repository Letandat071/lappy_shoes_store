'use client';

import React from 'react';
import Image from 'next/image';

interface FilterSidebarProps {
  onClose: () => void;
  isOpen: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onClose, isOpen }) => {
  const handlePriceChange = (value: number) => {
    // Handle price change
    console.log('Price changed:', value);
  };

  const handleColorSelect = (color: string) => {
    // Handle color selection
    console.log('Color selected:', color);
  };

  const handleSizeSelect = (size: string) => {
    // Handle size selection
    console.log('Size selected:', size);
  };

  const handleBrandSelect = (brand: string) => {
    // Handle brand selection
    console.log('Brand selected:', brand);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Filters</h2>
            <button
              onClick={onClose}
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
              className="w-full"
              onChange={(e) => handlePriceChange(Number(e.target.value))}
            />
            <div className="flex justify-between mt-2">
              <span>$0</span>
              <span>$1000</span>
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
                    className={`w-8 h-8 rounded-full border-2 border-gray-300`}
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
                  className="px-3 py-2 border rounded hover:bg-gray-100"
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
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                >
                  {brand}
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
    </div>
  );
};

export default FilterSidebar; 