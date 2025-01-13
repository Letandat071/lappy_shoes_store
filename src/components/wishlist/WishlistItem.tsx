import React from 'react';
import { StarRating } from '../common/StarRating';

interface WishlistItemProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
  };
  onRemove: (id: number) => void;
  onAddToCart: (id: number) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ product, onRemove, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-32 h-32 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <div className="flex items-center">
                <StarRating rating={product.rating} />
                <span className="text-gray-600 ml-2">({product.reviewCount})</span>
              </div>
            </div>
            <button 
              onClick={() => onRemove(product.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button 
              onClick={() => onAddToCart(product.id)}
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem; 