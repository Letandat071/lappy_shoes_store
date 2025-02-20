import dynamic from 'next/dynamic';

const ProductSuggestClient = dynamic(() => import('./ProductSuggestClient'), {
  ssr: false,
});

export default function ProductSuggest({ className = '' }) {
  return <ProductSuggestClient className={className} />;
}