import dynamic from 'next/dynamic';
import React from 'react';

// Loading component tái sử dụng
interface LoadingBlockProps {
  height: string;
  width?: string;
  className?: string;
}

const LoadingBlock = ({ height, width, className = '' }: LoadingBlockProps) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    style={{ height, width }}
  />
);

// Components lớn và không cần thiết ở first render
export const DynamicHeroSection = dynamic(() => import('@/components/home/HeroSection'), {
  loading: () => <LoadingBlock height="600px" className="w-full" />,
  ssr: true // Enable SSR vì đây là section quan trọng
});

export const DynamicCollectionSection = dynamic(() => import('@/components/home/CollectionSection'), {
  loading: () => <LoadingBlock height="400px" className="w-full" />,
  ssr: false // Disable SSR vì không quá quan trọng ở first render
});

export const DynamicCategorySection = dynamic(() => import('@/components/home/CategorySection'), {
  loading: () => <LoadingBlock height="300px" className="w-full" />,
  ssr: false
});

// Modal components - luôn disable SSR vì không cần thiết
export const DynamicProductQuickView = dynamic(() => import('@/components/product/ProductQuickView'), {
  loading: () => <LoadingBlock height="500px" width="600px" className="mx-auto" />,
  ssr: false
});

export const DynamicOrderDetailsModal = dynamic(() => import('@/components/order/OrderDetailsModal'), {
  loading: () => <LoadingBlock height="600px" width="800px" className="mx-auto" />,
  ssr: false
});

// Components có heavy computation
export const DynamicProductsReview = dynamic(() => import('@/components/product/ProductsReview'), {
  loading: () => <LoadingBlock height="400px" className="w-full" />,
  ssr: true // Enable SSR để có SEO cho reviews
});

export const DynamicProductSuggest = dynamic(() => import('@/components/product/ProductSuggest'), {
  loading: () => <LoadingBlock height="300px" className="w-full" />,
  ssr: false
}); 