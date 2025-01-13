import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
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

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  discount
}) => {
  return (
    <Link href={`/product/${id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative">
          <Image 
            src={image}
            alt={name}
            width={400}
            height={400}
            className="w-full h-64 object-cover"
          />
          {discount && (
            <div className="absolute top-4 right-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                -{discount}%
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
              <i className="far fa-heart"></i>
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold">{name}</h3>
              <p className="text-sm text-gray-600">{category}</p>
            </div>
            <div className="flex text-yellow-400 text-sm">
              <i className="fas fa-star"></i>
              <span className="text-gray-600 ml-1">{rating}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              {originalPrice && (
                <span className="text-gray-400 line-through text-sm mr-2">
                  ${originalPrice}
                </span>
              )}
              <span className="font-bold text-lg">${price}</span>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 