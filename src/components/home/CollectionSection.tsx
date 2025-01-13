import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CollectionSection = () => {
  const collections = [
    {
      title: 'Summer Collection',
      description: 'Light & Breathable',
      mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      gridImages: [
        {
          url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
          name: 'Nike Air Max 270',
          price: 150
        },
        {
          url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
          name: 'Nike React Vision',
          price: 140
        },
        {
          url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2',
          name: 'Nike Zoom Fly',
          price: 160
        },
        {
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
          name: 'Nike Air Force 1',
          price: 120
        },
        {
          url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
          name: 'Nike Free RN',
          price: 110
        },
        {
          url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
          name: 'Nike Joyride',
          price: 180
        }
      ],
      link: '/collections/summer'
    },
    {
      title: 'Sport Elite',
      description: 'Performance & Style',
      mainImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      gridImages: [
        {
          url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
          name: 'Nike Metcon 6',
          price: 130
        },
        {
          url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb',
          name: 'Nike SuperRep Go',
          price: 100
        },
        {
          url: 'https://images.unsplash.com/photo-1539185441755-769473a23570',
          name: 'Nike Pegasus 38',
          price: 120
        },
        {
          url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6',
          name: 'Nike Infinity Run',
          price: 160
        },
        {
          url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111',
          name: 'Nike ZoomX',
          price: 200
        },
        {
          url: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9',
          name: 'Nike Terra Kiger',
          price: 140
        }
      ],
      link: '/collections/sport'
    },
    {
      title: 'Limited Edition',
      description: 'Exclusive Designs',
      mainImage: 'https://images.unsplash.com/photo-1597248881519-db089d3744a5',
      gridImages: [
        {
          url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6',
          name: 'Nike x Off-White',
          price: 250
        },
        {
          url: 'https://images.unsplash.com/photo-1621665421558-831f91fd0500',
          name: 'Nike x Travis Scott',
          price: 300
        },
        {
          url: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f',
          name: 'Nike x Supreme',
          price: 280
        },
        {
          url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3',
          name: 'Nike x Fragment',
          price: 260
        },
        {
          url: 'https://images.unsplash.com/photo-1520256862855-398228c41684',
          name: 'Nike x Sacai',
          price: 220
        },
        {
          url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
          name: 'Nike x Ambush',
          price: 240
        }
      ],
      link: '/collections/limited'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Featured Collections</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Discover our carefully curated collections, featuring the latest trends and timeless classics
        </p>
        
        <div className="space-y-32">
          {collections.map((collection, index) => (
            <div key={index} className="relative">
              {/* Collection Title Overlay */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-lg z-10">
                <h3 className="text-3xl font-bold">{collection.title}</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Main Image */}
                <div className="lg:col-span-6 relative h-[500px] overflow-hidden rounded-lg">
                  <Image
                    src={`${collection.mainImage}?auto=format&fit=crop&w=800&q=80`}
                    alt={collection.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300">
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white text-lg mb-4">{collection.description}</p>
                      <Link 
                        href={collection.link}
                        className="inline-block bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Explore Collection
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Grid Images */}
                <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[160px]">
                  {collection.gridImages.map((img, imgIndex) => (
                    <Link 
                      href={`/product/${img.name.toLowerCase().replace(/ /g, '-')}`}
                      key={imgIndex}
                      className={`relative overflow-hidden rounded-lg group ${
                        imgIndex === 0 ? 'md:col-span-2 md:row-span-2 md:h-[336px]' : 'h-[160px]'
                      }`}
                    >
                      <Image
                        src={`${img.url}?auto=format&fit=crop&w=${imgIndex === 0 ? '800' : '400'}&q=80`}
                        alt={img.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes={imgIndex === 0 ? 
                          "(max-width: 768px) 100vw, 33vw" : 
                          "(max-width: 768px) 50vw, 16.67vw"}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h4 className="text-white text-lg font-semibold text-center px-4">{img.name}</h4>
                        <p className="text-yellow-400 font-bold mt-2">${img.price}</p>
                        <button className="mt-4 bg-white text-black px-6 py-2 rounded-full text-sm hover:bg-yellow-400 transition-colors">
                          Quick View
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection; 