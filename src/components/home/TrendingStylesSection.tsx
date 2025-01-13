import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const trendingStyles = [
  {
    id: 1,
    name: 'Street Style',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    description: 'Urban fashion meets comfort'
  },
  {
    id: 2,
    name: 'Athletic Performance',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    description: 'Engineered for peak performance'
  },
  {
    id: 3,
    name: 'Casual Comfort',
    image: 'https://images.unsplash.com/photo-1597248881519-db089d3744a5',
    description: 'Everyday style and comfort'
  }
];

const TrendingStylesSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trending Styles</h2>
          <p className="text-gray-600">
            Discover the latest trends in footwear fashion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingStyles.map((style) => (
            <Link 
              key={style.id}
              href={`/category/${style.name.toLowerCase().replace(' ', '-')}`}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-30">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">{style.name}</h3>
                    <p className="text-sm opacity-90">{style.description}</p>
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

export default TrendingStylesSection; 