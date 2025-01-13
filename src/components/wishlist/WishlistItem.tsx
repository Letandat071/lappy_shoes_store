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
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  name,
  price,
  image,
  inStock = true,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-6 p-4 bg-white rounded-2xl shadow-lg">
      <div className="relative w-24 h-24">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1">
        <Link href={`/product/${id}`} className="hover:text-blue-600">
          <h3 className="font-semibold mb-1">{name}</h3>
        </Link>
        <span className="font-bold">${price}</span>
        <p className={`text-sm ${inStock ? 'text-green-500' : 'text-red-500'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="primary">
          Add to Cart
        </Button>
        <Button 
          variant="outline"
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-600"
        >
          <i className="fas fa-trash"></i>
        </Button>
      </div>
    </div>
  );
};

export default WishlistItem; 