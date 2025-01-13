import React from 'react';

const SearchFilters = () => {
  return (
    <div className="lg:w-1/4 space-y-6">
      {/* Categories Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" defaultChecked />
            Running (12)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            Basketball (5)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            Lifestyle (7)
          </label>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <input type="range" min="0" max="500" className="w-full price-slider" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>$500</span>
          </div>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" className="w-1/2 px-3 py-1 border rounded-lg" />
            <input type="number" placeholder="Max" className="w-1/2 px-3 py-1 border rounded-lg" />
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Brand</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" defaultChecked />
            Nike (15)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            Adidas (8)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            Puma (4)
          </label>
        </div>
      </div>

      {/* Size Filter */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {['US 7', 'US 8', 'US 9', 'US 10', 'US 11'].map((size) => (
            <label key={size} className="text-center border rounded-lg py-2 cursor-pointer hover:border-black">
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
            { color: 'bg-black' },
            { color: 'bg-white' },
            { color: 'bg-red-500' },
            { color: 'bg-blue-500' }
          ].map((item, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full ${item.color} border-2 cursor-pointer hover:scale-110 transition-transform`}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
        Clear All Filters
      </button>
    </div>
  );
};

export default SearchFilters; 