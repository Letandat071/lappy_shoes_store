import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewCount: number;
    image: string;
    category: string;
    discount: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg">
        {/* Discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            -{product.discount}%
          </div>
        )}
        
        {/* Product image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Product info */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">{product.category}</p>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {product.reviewCount} reviews
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 