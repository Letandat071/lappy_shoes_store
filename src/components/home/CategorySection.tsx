import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 1,
    name: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    count: 120
  },
  {
    id: 2,
    name: 'Basketball',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    count: 89
  },
  {
    id: 3,
    name: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1597248881519-db089d3744a5',
    count: 204
  },
  {
    id: 4,
    name: 'Training',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    count: 156
  }
];

const CategorySection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className="group"
            >
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} Products</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 