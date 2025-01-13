'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import ProductCard from '@/components/product/ProductCard';

interface ProductPageProps {
  params: {
    id: string;
  };
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  discount?: number;
}

// Mock data - replace with real API call
const product = {
  id: '1',
  name: 'Nike Air Max 270',
  category: 'Running Collection',
  price: 159.99,
  originalPrice: 199.99,
  rating: 4.5,
  reviewCount: 128,
  description: `The Nike Air Max 270 delivers a bold look inspired by Air Max icons. 
    Featuring Nike's biggest heel Air unit yet, it provides unrivaled comfort and a sleek, 
    modern design. The shoe's bootie construction delivers a snug fit, while the mesh upper 
    offers breathable comfort for all-day wear.`,
  features: [
    'Mesh and synthetic upper for breathability',
    'Large Max Air unit delivers enhanced cushioning',
    'Rubber outsole for durable traction'
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

const relatedProducts: Product[] = [
  // Add related products data
];

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = React.useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  useEffect(() => {
    // Initialize states after component mounts
    if (product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, []);

  const updateQuantity = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <main>
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
        <nav className="flex text-gray-500 text-sm">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-black">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg">
              {selectedImage && (
                <Image 
                  src={selectedImage}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-[500px] object-contain main-image"
                />
              )}
              <button className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-sm">
                <i className="fas fa-360-degrees mr-2"></i>360° View
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`thumbnail bg-white rounded-lg p-4 border-2 ${
                    selectedImage === image ? 'border-black' : 'border-transparent hover:border-black'
                  }`}
                >
                  <Image 
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
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
                <span className="text-gray-400 line-through text-xl">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-500 px-2 py-1 rounded text-sm">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            {/* Color Options */}
            <div>
              <h3 className="font-semibold mb-4">Select Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <div key={color}>
                    <input 
                      type="radio" 
                      name="color" 
                      id={`color-${color}`} 
                      className="color-option hidden"
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                    />
                    <label 
                      htmlFor={`color-${color}`} 
                      className={`block w-8 h-8 rounded-full bg-${color.toLowerCase()}-500 border-2 border-gray-300 cursor-pointer transition-transform ${
                        selectedColor === color ? 'transform scale-110 border-black' : ''
                      }`}
                    ></label>
                  </div>
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
                  <div key={size}>
                    <input 
                      type="radio" 
                      name="size" 
                      id={`size-${size}`} 
                      className="size-option hidden"
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                    />
                    <label 
                      htmlFor={`size-${size}`} 
                      className={`block text-center border-2 rounded-lg py-2 cursor-pointer hover:border-black ${
                        selectedSize === size ? 'bg-black text-white border-black' : ''
                      }`}
                    >
                      {size}
                    </label>
                  </div>
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
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
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
                  <div className="flex-1 review-progress-bar">
                    <div style={{ width: `${percentage}%` }}></div>
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
                      alt="Review Image"
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
              <i className="fas fa-chevron-down ml-2"></i>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
} 