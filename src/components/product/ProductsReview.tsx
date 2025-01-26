import React from 'react'
import Button from '@/components/common/Button';
import Image from 'next/image';

interface ProductsReviewProps {
  productId: string;
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
  
const ProductsReview: React.FC<ProductsReviewProps> = ({ productId }) => {
  return (
    <div> {/* Reviews Section */}
    <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star${i + 1 > product.rating ? '-half-alt' : ''}`}></i>
              ))}
            </div>
            <span className="text-gray-600">Based on {product.reviewCount} reviews</span>
          </div>
        </div>
        <Button variant="primary">
          Write a Review
        </Button>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          {Object.entries(product.ratingDistribution).reverse().map(([rating, percentage]) => (
            <div key={rating} className="flex items-center gap-4">
              <span className="w-16">{rating} stars</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-16 text-right">{percentage}%</span>
            </div>
          ))}
        </div>

        {/* Review Highlights */}
        <div>
          <h3 className="font-semibold mb-4">Review Highlights</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">Comfortable (45)</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">Stylish (38)</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">Great Quality (32)</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">True to Size (28)</span>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-8">
        {product.reviews.map((review) => (
          <div key={review.id} className="border-t pt-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <Image 
                  src={review.user.avatar}
                  alt={review.user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{review.user.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <span>Verified Purchase</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            <h5 className="font-semibold mb-2">{review.title}</h5>
            <p className="text-gray-600 mb-4">{review.content}</p>
            <div className="flex gap-4 mb-4">
              {review.images.map((image, index) => (
                <Image 
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black">
                <i className="far fa-thumbs-up"></i>
                Helpful ({review.helpful})
              </button>
              <button className="text-gray-600 hover:text-black">Report</button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Reviews */}
      <div className="text-center mt-8">
        <Button variant="outline">
          Load More Reviews
        </Button>
      </div>
    </div></div>
  )
}

export default ProductsReview