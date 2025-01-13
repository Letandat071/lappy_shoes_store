import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, rating }) => {
  return (
    <Link href={`/product/${id}`} className="group">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="relative mb-4 aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-xl group-hover:scale-105 transition-transform"
          />
        </div>
        <h3 className="font-semibold mb-2 group-hover:text-blue-600">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star${i + 1 > rating ? '-half-alt' : ''}`}></i>
            ))}
          </div>
        </div>
        <span className="font-bold">${price}</span>
      </div>
    </Link>
  );
};

export default ProductCard; 