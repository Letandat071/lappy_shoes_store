import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

interface ProductSuggestProps {
  categoryId: string;
  currentProductId: string;
}

const product = {
    id: '1',
    name: 'Nike Air Max 270',
    price: 159.99,
    originalPrice: 199.99,
    discount: 20,
    rating: 4.5,
    reviewCount: 128,
    description: `The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it features Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.`,
    features: [
      'Lightweight mesh upper for breathability',
      'Foam midsole for responsive cushioning',
      'Rubber outsole for durability',
      'Heel Air unit for maximum comfort'
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
      'https://images.unsplash.com/photo-1605408499391-6368c628ef42'
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['Black', 'White', 'Red', 'Blue'],
    reviews: [
      {
        id: '1',
        user: {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/100?img=1'
        },
        rating: 5,
        date: '2 days ago',
        title: 'Best running shoes ever!',
        content: `These shoes are incredibly comfortable and stylish. The air cushioning makes them perfect for all-day wear. 
          I've been using them for both running and casual wear, and they perform excellently in both situations.`,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'
        ],
        helpful: 24
      }
    ],
    ratingDistribution: {
      5: 70,
      4: 20,
      3: 5,
      2: 3,
      1: 2
    }
  };
  
  const relatedProducts = [
    {
      id: '2',
      name: 'Nike Air Zoom Pegasus',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      rating: 4.8,
      reviewCount: 95
    },
    {
      id: '3',
      name: 'Nike Free RN',
      price: 109.99,
      image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
      rating: 4.6,
      reviewCount: 82
    },
    {
      id: '4',
      name: 'Nike Revolution',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42',
      rating: 4.4,
      reviewCount: 67
    }
  ];

const ProductSuggest: React.FC<ProductSuggestProps> = ({ categoryId, currentProductId }) => {
  return (
    <div>
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="relative mb-4 aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star${i + 1 > product.rating ? '-half-alt' : ''}`}></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                  </div>
                  <span className="font-bold">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
  )
}

export default ProductSuggest