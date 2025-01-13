import React from 'react';
import ProductCard from '@/components/product/ProductCard';

const featuredProducts = [
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
  {
    id: '2',
    name: 'Nike Air Jordan',
    category: 'Basketball Collection',
    price: 189.99,
    originalPrice: 229.99,
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    discount: 15
  },
  {
    id: '3',
    name: 'Nike Free Run',
    category: 'Running Collection',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.3,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    discount: 10
  },
  {
    id: '4',
    name: 'Nike Metcon',
    category: 'Training Collection',
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.6,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    discount: 25
  }
];

const BestSellersSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Best Sellers</h2>
          <div className="flex gap-4">
            <button className="text-gray-400 hover:text-black">
              <i className="fas fa-arrow-left text-2xl"></i>
            </button>
            <button className="text-gray-400 hover:text-black">
              <i className="fas fa-arrow-right text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection; 