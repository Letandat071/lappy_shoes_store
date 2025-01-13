import React from 'react';
import Button from '@/components/common/Button';

interface Category {
  name: string;
  image: string;
  productCount: number;
}

const categories: Category[] = [
  {
    name: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    productCount: 120
  },
  {
    name: 'Basketball',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    productCount: 85
  },
  {
    name: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    productCount: 200
  },
  {
    name: 'Training',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    productCount: 150
  }
];

const CategorySection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold">Shop by Category</h2>
        <Button variant="outline">
          View All Categories <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div key={category.name} className="group relative overflow-hidden rounded-2xl cursor-pointer">
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              <p className="text-sm text-gray-300">{category.productCount}+ Products</p>
              <Button 
                variant="primary" 
                size="small"
                className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
              >
                Shop Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection; 