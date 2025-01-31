"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/common/UserAvatar';
import { useProducts } from '@/hooks/useProducts';
import { useFeatures } from '@/hooks/useFeatures';
import { useCartContext } from '@/contexts/CartContext';
import { useWishlistContext } from '@/contexts/WishlistContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCartContext();
  const { wishlist } = useWishlistContext();

  // Fetch features
  const { features, loading: featuresLoading } = useFeatures();

  // Fetch search results
  const { products, loading } = useProducts({
    search: searchQuery,
    limit: 5
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setShowSearchResults(false);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  const handleCategoryClick = (audience: string) => {
    router.push(`/shop?audience=${audience}`);
  };

  const handleBrandClick = (brand: string) => {
    router.push(`/shop?brand=${brand}`);
  };

  const handleFeatureClick = (featureName: string) => {
    router.push(`/shop?feature=${encodeURIComponent(featureName)}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
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
                <Link href="/shop" className="hover:text-gray-600" onClick={(e) => {
                  // Cho phép click trực tiếp vào Shop
                  e.stopPropagation();
                }}>
                  Shop
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button 
                    onClick={() => handleCategoryClick('men')} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Nam
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('women')} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Nữ
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('kids')} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Trẻ em
                  </button>
                  <button 
                    onClick={() => handleCategoryClick('unisex')} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Unisex
                  </button>
                </div>
              </div>

              {/* Features Dropdown */}
              <div className="relative group">
                <Link href="/featured" className="hover:text-gray-600">
                  Features
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {featuresLoading ? (
                    <div className="px-4 py-2 text-gray-500">Loading...</div>
                  ) : features.length > 0 ? (
                    features.map((feature) => (
                      <button
                        key={feature._id}
                        onClick={() => handleFeatureClick(feature.name)}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                      >
                        {feature.icon && (
                          <span className="mr-2 text-lg">{feature.icon}</span>
                        )}
                        <span>{feature.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No features available</div>
                  )}
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
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Search products..."
                  className="w-48 lg:w-64 px-4 py-1 rounded-l-full border focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-black text-white rounded-r-full hover:bg-gray-800"
                >
                  <i className="fas fa-search text-lg"></i>
                </button>

                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : products.length > 0 ? (
                      <>
                        {products.map((product) => (
                          <Link
                            key={product._id}
                            href={`/product/${product._id}`}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50"
                          >
                            <div className="relative w-12 h-12">
                              <Image
                                src={product.images[0]?.url || ''}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-500">${product.price}</p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                          className="block p-4 text-center text-blue-600 hover:bg-gray-50 border-t"
                        >
                          View all results
                        </Link>
                      </>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* User Account */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 hover:text-gray-600"
                    >
                      <UserAvatar name={user.name} image={user.avatar} size={32} />
                      <span className="hidden lg:inline">{user.name}</span>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Hồ sơ
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Đơn hàng
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="hover:text-gray-600 hidden sm:block"
                  >
                    Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="hover:text-gray-600 hidden sm:block">
                <div className="relative">
                  <i className="far fa-heart text-xl"></i>
                  {wishlist.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlist.totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="hover:text-gray-600">
                <div className="relative">
                  <i className="fas fa-shopping-cart text-xl"></i>
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cart.totalItems}
                    </span>
                  )}
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
                    <Link href="/shop?audience=men" className="block text-gray-600">Men</Link>
                    <Link href="/shop?audience=women" className="block text-gray-600">Women</Link>
                    <Link href="/shop?audience=kids" className="block text-gray-600">Kids</Link>
                    <Link href="/shop?audience=unisex" className="block text-gray-600">Unisex</Link>
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
                  {!user && (
                    <Link href="/auth" className="block text-gray-600 sm:hidden">
                      Đăng nhập / Đăng ký
                    </Link>
                  )}
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