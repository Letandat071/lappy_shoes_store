import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  discount
}) => {
  return (
    <Link href={`/product/${id}`} className="group">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4">
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
            -{discount}%
          </div>
        )}
        <div className="relative w-full h-[300px]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <h3 className="font-semibold mb-1 group-hover:text-primary-600 transition-colors">
        {name}
      </h3>
      <div className="flex items-center gap-2">
        <span className="font-bold">${price}</span>
        {originalPrice && (
          <span className="text-gray-500 line-through text-sm">${originalPrice}</span>
        )}
      </div>
      <div className="flex items-center gap-1 mt-1">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fas fa-star text-sm ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
        ))}
      </div>
    </Link>
  );
};

export default ProductCard; 