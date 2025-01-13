import React from 'react';
import Link from 'next/link';

const EmptyWishlist = () => {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="far fa-heart text-4xl text-gray-400"></i>
      </div>
      <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
      <p className="text-gray-600 mb-8">
        Browse our products and add your favorites to the wishlist
      </p>
      <Link 
        href="/shop" 
        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 inline-block transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyWishlist; 