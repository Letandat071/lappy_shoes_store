import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';

interface WishlistItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  name,
  price,
  image,
  inStock = true,
  onRemove,
  onAddToCart
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="rounded-md"
        />
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-600">${price}</p>
          <p className={`text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onAddToCart(id)}
          disabled={!inStock}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button
          onClick={() => onRemove(id)}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistItem; 