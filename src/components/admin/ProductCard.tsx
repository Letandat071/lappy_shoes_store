import React from 'react';
import Image from 'next/image';
import mongoose from 'mongoose';

interface ProductCardProps {
  product: {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      color?: string;
      version?: string;
    }>;
    category: {
      name: string;
    } | null;
    brand: string;
    status: string;
  };
  onEdit: (product: any) => void;
  onDelete: (id: mongoose.Types.ObjectId | string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={product.images[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Giá: {product.price.toLocaleString()}đ</span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {product.category?.name || 'Không có danh mục'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Thương hiệu: {product.brand}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.status === 'in-stock' 
                  ? 'bg-green-100 text-green-800'
                  : product.status === 'out-of-stock'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {product.status === 'in-stock' 
                  ? 'Còn hàng'
                  : product.status === 'out-of-stock'
                  ? 'Hết hàng'
                  : 'Sắp về hàng'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 justify-center">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="text-red-600 hover:text-red-800"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 