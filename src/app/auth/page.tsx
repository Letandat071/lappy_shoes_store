import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AuthTabs from '../../components/auth/AuthTabs';

const AuthPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex text-gray-500 text-sm mb-8">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Sign In</span>
          </nav>

          {/* Auth Container */}
          <div className="max-w-md mx-auto">
            <AuthTabs />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuthPage; 