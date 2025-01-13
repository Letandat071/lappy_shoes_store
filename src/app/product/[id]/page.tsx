'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';

// Mock data cho sản phẩm
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

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = React.useState(product.images[0]);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  const updateQuantity = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/shop" className="text-gray-500 hover:text-black">
            Shop
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg">
              <Image 
                src={selectedImage}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-[500px] object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`bg-white rounded-lg p-4 border-2 ${
                    selectedImage === image ? 'border-black' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <Image 
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-20 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium mb-4">
                New Arrival
              </span>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star${i + 1 > product.rating ? '-half-alt' : ''}`}></i>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-green-500">In Stock</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-xl">${product.originalPrice}</span>
                    <span className="bg-red-100 text-red-500 px-2 py-1 rounded text-sm">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Options */}
            <div>
              <h3 className="font-semibold mb-4">Select Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedColor === color 
                        ? 'border-black scale-110' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Size Options */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Select Size</h3>
                <button className="text-gray-600 hover:text-black text-sm">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border-2 rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 rounded-lg">
                <button 
                  className="px-4 py-2 hover:bg-gray-100" 
                  onClick={() => updateQuantity(-1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  min="1" 
                  className="w-16 text-center border-x-2"
                  readOnly
                />
                <button 
                  className="px-4 py-2 hover:bg-gray-100" 
                  onClick={() => updateQuantity(1)}
                >
                  +
                </button>
              </div>
              <Button variant="primary" className="flex-1">
                Add to Cart
              </Button>
              <Button variant="outline" className="w-12 h-12 flex items-center justify-center p-0">
                <i className="far fa-heart"></i>
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-truck"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">Free Shipping</h4>
                    <p className="text-sm text-gray-600">Free shipping on orders over $150</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-undo"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t pt-8">
              <h3 className="font-semibold mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <div className="mt-4 space-y-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <i className="fas fa-check text-green-500"></i>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
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
        </div>

        {/* Related Products */}
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
      </div>
      <Footer />
    </main>
  );
};

export default ProductPage; 