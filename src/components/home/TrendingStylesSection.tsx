import React from 'react';

const styles = [
  {
    name: 'Street Style',
    tag: '#StreetStyle',
    description: 'Perfect for city adventures',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'
  },
  {
    name: 'Athletic Pro Series',
    tag: '#Performance',
    description: 'Engineered for performance',
    image: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42'
  },
  {
    name: 'Everyday Comfort',
    tag: '#Lifestyle',
    description: 'Style meets comfort',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519'
  }
];

const TrendingStylesSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Trending Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {styles.map((style) => (
            <div key={style.name} className="group relative overflow-hidden rounded-2xl">
              <img 
                src={style.image} 
                alt={style.name} 
                className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium">
                  {style.tag}
                </span>
                <h3 className="text-white text-2xl font-bold mt-2">{style.name}</h3>
                <p className="text-gray-200 mt-2">{style.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingStylesSection; 