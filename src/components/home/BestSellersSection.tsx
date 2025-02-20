"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from "@heroicons/react/24/outline";
import { formatPrice } from '@/utils/format';
import { showToast } from '@/components/common/Toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: Array<{
    url: string;
    color?: string;
  }>;
  category: {
    name: string;
  };
  rating?: number;
  reviewCount?: number;
  totalSold?: number;
}

export default function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchBestSellers = async () => {
      try {
        const res = await fetch('/api/products/best-sellers');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Có lỗi xảy ra');
        }

        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        showToast.error('Không thể tải sản phẩm bán chạy');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Tránh hydration mismatch
  if (!mounted) return null;

  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl p-6 shadow-lg">
            <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="best-sellers py-12 bg-white">
        <LoadingSkeleton />
      </section>
    );
  }

  return (
    <section className="best-sellers py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
          <Link 
            href="/products?sort=best-selling"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                {/* Product Image */}
                <div className="relative group">
                  <Image
                    src={product.images[0]?.url || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      -{product.discount}%
                    </div>
                  )}
                  {product.totalSold && product.totalSold > 50 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                      Hot
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-4">
                  <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{formatPrice(product.price)}đ</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}đ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                  {product.totalSold && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${Math.min((product.totalSold / 100) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        Đã bán {product.totalSold}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 