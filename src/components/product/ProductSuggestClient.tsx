"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/utils/format';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    color?: string;
  }>;
  category: {
    name: string;
  };
  rating?: number;
  reviewCount?: number;
  suggestionType: 'viewed' | 'purchased' | 'category' | 'search';
  suggestionReason: string;
}

interface ProductSuggestClientProps {
  className?: string;
}

export default function ProductSuggestClient({ className = '' }: ProductSuggestClientProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const getUserBehavior = useCallback(() => {
    try {
      return {
        viewedProducts: JSON.parse(localStorage.getItem('viewedProducts') || '[]'),
        purchasedProducts: JSON.parse(localStorage.getItem('purchasedProducts') || '[]'),
        searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
        categoryPreferences: JSON.parse(localStorage.getItem('categoryPreferences') || '[]')
      };
    } catch (error) {
      console.error('Error getting user behavior:', error);
      return {
        viewedProducts: [],
        purchasedProducts: [],
        searchHistory: [],
        categoryPreferences: []
      };
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    if (!session) return;

    try {
      setLoading(true);
      const behavior = getUserBehavior();
      console.log('Fetching suggestions with behavior:', behavior);

      const response = await fetch('/api/products/suggestions?' + new URLSearchParams({
        behavior: JSON.stringify(behavior)
      }));

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      console.log('Received suggestions:', data);
      setSuggestions(data.products || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [session, getUserBehavior]);

  useEffect(() => {
    if (session) {
      fetchSuggestions();
    }
  }, [session, fetchSuggestions]);

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed, refetching suggestions');
      fetchSuggestions();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userBehaviorChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userBehaviorChange', handleStorageChange);
    };
  }, [fetchSuggestions]);

  if (!session) return null;

  if (loading) {
    return (
      <section className={`suggestions py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">AI Gợi ý cho bạn</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!suggestions.length) return null;

  return (
    <section className={`suggestions py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">AI Gợi ý cho bạn</h2>
          <SparklesIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {suggestions.map((product) => (
            <Link 
              key={product._id} 
              href={`/product/${product._id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0]?.url || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold">
                      {formatPrice(product.price)}₫
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-500 line-through text-sm">
                        {formatPrice(product.originalPrice)}₫
                      </span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      {product.reviewCount && (
                        <span className="text-sm text-gray-500">
                          ({product.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    {product.suggestionReason}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 