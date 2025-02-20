import React from 'react';
import { Dialog } from '@headlessui/react';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/utils/format';

interface ProductQuickViewProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: Array<{
      url: string;
      color?: string;
    }>;
    sizes: Array<{
      size: string;
      quantity: number;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (size: string) => void;
}

export default function ProductQuickView({ product, isOpen, onClose, onAddToCart }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = React.useState('');

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-lg bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ảnh sản phẩm */}
            <div className="relative aspect-square">
              <ImageWithFallback
                src={product.images[0]?.url || ''}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                {product.name}
              </Dialog.Title>

              <div className="mt-4">
                <p className="text-xl font-semibold text-gray-900">
                  {formatPrice(product.price)}₫
                </p>
              </div>

              <div className="mt-4">
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Size selector */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {product.sizes.map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      onClick={() => setSelectedSize(sizeOption.size)}
                      disabled={sizeOption.quantity === 0}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-md
                        ${selectedSize === sizeOption.size
                          ? 'bg-gray-900 text-white'
                          : sizeOption.quantity === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      {sizeOption.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart button */}
              <div className="mt-8">
                <button
                  onClick={() => selectedSize && onAddToCart(selectedSize)}
                  disabled={!selectedSize}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium
                    hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Đóng</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 