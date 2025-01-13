import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CartItems from '../../components/cart/CartItems';
import OrderSummary from '../../components/cart/OrderSummary';
import EmptyCart from '../../components/cart/EmptyCart';
import RecommendedProducts from '../../components/cart/RecommendedProducts';

const CartPage = () => {
  // Mock data - có thể chuyển thành state hoặc lấy từ API sau
  const cartItemCount = 3;
  const hasItems = cartItemCount > 0;

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Shopping Cart</span>
          </nav>
        </div>

        {/* Cart Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItemCount})</h1>

          {hasItems ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3 space-y-6">
                <CartItems />
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <OrderSummary />
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </section>

        {/* Product Recommendations */}
        <RecommendedProducts />
      </main>
      <Footer />
    </>
  );
};

export default CartPage; 