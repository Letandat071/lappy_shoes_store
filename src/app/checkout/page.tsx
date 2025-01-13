import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';

const CheckoutPage = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:text-black">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Checkout</span>
          </nav>
        </div>

        {/* Checkout Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Forms */}
            <div className="lg:w-2/3">
              <ShippingForm />
              <PaymentForm />
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <CheckoutSummary />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage; 