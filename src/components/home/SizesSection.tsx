import React from 'react';
import Button from '@/components/common/Button';

const sizes = [
  { size: '6', inStock: true },
  { size: '6.5', inStock: true },
  { size: '7', inStock: true },
  { size: '7.5', inStock: true },
  { size: '8', inStock: true },
  { size: '8.5', inStock: false },
  { size: '9', inStock: true },
  { size: '9.5', inStock: true },
  { size: '10', inStock: true },
  { size: '10.5', inStock: false },
  { size: '11', inStock: true },
  { size: '11.5', inStock: true },
  { size: '12', inStock: true },
  { size: '12.5', inStock: false },
  { size: '13', inStock: true }
];

const SizesSection = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Find Your Perfect Size</h2>
              <p className="text-gray-600 mb-8">
                Not sure about your size? Use our size guide to find the perfect fit. 
                We offer a wide range of sizes to ensure maximum comfort for every foot type.
              </p>
              <div className="grid grid-cols-5 gap-2 mb-8">
                {sizes.map((item) => (
                  <div
                    key={item.size}
                    className={`text-center p-3 rounded-lg border ${
                      item.inStock
                        ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {item.size}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Button variant="primary" size="large" className="w-full">
                  View Size Guide
                </Button>
                <Button variant="outline" size="large" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d"
                alt="Size Guide"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-black p-4 rounded-xl">
                <p className="text-lg font-bold">Free Returns</p>
                <p className="text-sm">If the size doesn't fit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizesSection; 