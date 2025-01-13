"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed w-full bg-white z-50">
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <span className="hidden sm:inline">Free shipping for orders over $100 | Easy 30-day returns</span>
        <span className="sm:hidden">Free shipping over $100</span>
      </div>

      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>

            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-bold">
              Lappy Shoes
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Shop Dropdown */}
              <div className="relative group">
                <Link href="/shop" className="hover:text-gray-600">
                  Shop
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/shop?category=men" className="block px-4 py-2 hover:bg-gray-100">Men</Link>
                  <Link href="/shop?category=women" className="block px-4 py-2 hover:bg-gray-100">Women</Link>
                  <Link href="/shop?category=kids" className="block px-4 py-2 hover:bg-gray-100">Kids</Link>
                </div>
              </div>

              {/* Featured Dropdown */}
              <div className="relative group">
                <Link href="/featured" className="hover:text-gray-600">
                  Featured
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/featured?category=new-releases" className="block px-4 py-2 hover:bg-gray-100">New Releases</Link>
                  <Link href="/featured?category=best-sellers" className="block px-4 py-2 hover:bg-gray-100">Best Sellers</Link>
                  <Link href="/featured?category=limited-edition" className="block px-4 py-2 hover:bg-gray-100">Limited Edition</Link>
                  <Link href="/featured?category=collections" className="block px-4 py-2 hover:bg-gray-100">Collections</Link>
                </div>
              </div>

              <Link href="/about" className="hover:text-gray-600">About Us</Link>
              <Link href="/help" className="hover:text-gray-600">Help</Link>
            </div>

            {/* Icons Section */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Search Icon for Mobile */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden"
              >
                <i className="fas fa-search text-xl"></i>
              </button>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-48 lg:w-64 px-4 py-1 rounded-l-full border focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-black text-white rounded-r-full hover:bg-gray-800"
                >
                  <i className="fas fa-search text-lg"></i>
                </button>
              </form>

              {/* Account */}
              <Link href="/auth" className="hover:text-gray-600 hidden sm:block">
                <i className="far fa-user text-xl"></i>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="hover:text-gray-600 hidden sm:block">
                <div className="relative">
                  <i className="far fa-heart text-xl"></i>
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </div>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="hover:text-gray-600">
                <div className="relative">
                  <i className="fas fa-shopping-cart text-xl"></i>
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 rounded-l-full border focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-r-full hover:bg-gray-800"
                >
                  <i className="fas fa-search text-lg"></i>
                </button>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t">
              <div className="py-2">
                {/* Shop Section */}
                <div className="px-4 py-2">
                  <div className="font-medium mb-2">Shop</div>
                  <div className="space-y-2 pl-4">
                    <Link href="/shop?category=men" className="block text-gray-600">Men</Link>
                    <Link href="/shop?category=women" className="block text-gray-600">Women</Link>
                    <Link href="/shop?category=kids" className="block text-gray-600">Kids</Link>
                  </div>
                </div>

                {/* Featured Section */}
                <div className="px-4 py-2">
                  <div className="font-medium mb-2">Featured</div>
                  <div className="space-y-2 pl-4">
                    <Link href="/featured?category=new-releases" className="block text-gray-600">New Releases</Link>
                    <Link href="/featured?category=best-sellers" className="block text-gray-600">Best Sellers</Link>
                    <Link href="/featured?category=limited-edition" className="block text-gray-600">Limited Edition</Link>
                    <Link href="/featured?category=collections" className="block text-gray-600">Collections</Link>
                  </div>
                </div>

                {/* Other Links */}
                <div className="px-4 py-2 space-y-2">
                  <Link href="/about" className="block text-gray-600">About Us</Link>
                  <Link href="/help" className="block text-gray-600">Help</Link>
                  <Link href="/auth" className="block text-gray-600 sm:hidden">Account</Link>
                  <Link href="/wishlist" className="block text-gray-600 sm:hidden">Wishlist</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 