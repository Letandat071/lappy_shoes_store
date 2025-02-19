"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/common/UserAvatar";
import { useProducts } from "@/hooks/useProducts";
import { useFeatures } from "@/hooks/useFeatures";
import { useCartContext } from "@/contexts/CartContext";
import { useWishlistContext } from "@/contexts/WishlistContext";

// Định nghĩa interface cho Announcement
interface Announcement {
  _id: string;
  message: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCartContext();
  const { wishlist } = useWishlistContext();

  // Fetch features
  const { features, loading: featuresLoading } = useFeatures();

  // Thêm state để kiểm soát việc fetch dữ liệu
  const [hasFetchedAnnouncement, setHasFetchedAnnouncement] = useState(false);

  // State lưu thông báo
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chỉ gọi API thông báo một lần
  useEffect(() => {
    if (!hasFetchedAnnouncement) {
      const fetchAnnouncement = async () => {
        try {
          const response = await fetch("/api/announcements");
          const data = await response.json();
          if (response.ok && data.announcements) {
            console.log("Announcements fetched:", data.announcements);
            const now = new Date();
            const activeAnnouncements = data.announcements.filter(
              (ann: Announcement) => {
                if (!ann.isActive) {
                  console.log("Announcement is not active:", ann);
                  return false;
                }
                if (ann.startDate && now < new Date(ann.startDate)) {
                  console.log(
                    "Announcement filtered out due to startDate:",
                    ann
                  );
                  return false;
                }
                if (ann.endDate && now > new Date(ann.endDate)) {
                  console.log("Announcement filtered out due to endDate:", ann);
                  return false;
                }
                return true;
              }
            );
            console.log("Active announcements:", activeAnnouncements);
            if (activeAnnouncements.length > 0) {
              setAnnouncement(activeAnnouncements[0]);
            }
          }
        } catch (error) {
          console.error("Error fetching announcements", error);
        }
        setHasFetchedAnnouncement(true);
      };

      fetchAnnouncement();
    }
  }, [hasFetchedAnnouncement]);

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
    router.push(`/shop?audience=${audience.toLowerCase()}`, { scroll: true });
  };

  const handleFeatureClick = (featureName: string) => {
    router.push(`/shop?feature=${encodeURIComponent(featureName)}`, {
      scroll: true,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Tối ưu useProducts hook
  const { products, loading } = useProducts({
    search: searchQuery.trim(),
    limit: 5,
    enabled: showSearchResults && searchQuery.trim().length > 0,
    sort: "-createdAt",
  });

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/admin/features", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch features");
      }

      const data = await response.json();
      setFeatures(data.features);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-0 w-full z-50">
      {announcement && (
        <div
          style={{
            backgroundColor: announcement.backgroundColor,
            color: announcement.textColor,
          }}
          className="text-center py-2 text-sm"
        >
          {announcement.link ? (
            <a href={announcement.link} className="underline">
              {announcement.message}
            </a>
          ) : (
            announcement.message
          )}
        </div>
      )}
      <header className="bg-white">
        <nav className="border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
              >
                <i
                  className={`fas ${
                    isMobileMenuOpen ? "fa-times" : "fa-bars"
                  } text-xl`}
                ></i>
              </button>

              {/* Logo */}
              <Link href="/" className="text-xl md:text-2xl font-bold">
                Lappy Shoes
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {/* Shop Dropdown */}
                <div className="relative group">
                  <Link
                    href="/shop"
                    className="hover:text-gray-600"
                    onClick={(e) => {
                      // Cho phép click trực tiếp vào Shop
                      e.stopPropagation();
                    }}
                  >
                    Shop
                  </Link>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={() => handleCategoryClick("Men")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Nam
                    </button>
                    <button
                      onClick={() => handleCategoryClick("Women")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Nữ
                    </button>
                    <button
                      onClick={() => handleCategoryClick("Kids")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Trẻ em
                    </button>
                    <button
                      onClick={() => handleCategoryClick("Unisex")}
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
                      <div className="px-4 py-2 text-gray-500">
                        No features available
                      </div>
                    )}
                  </div>
                </div>

                <Link href="/about" className="hover:text-gray-600">
                  About Us
                </Link>
                <Link href="/help" className="hover:text-gray-600">
                  Help
                </Link>
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
                <form
                  onSubmit={handleSearch}
                  className="hidden md:flex items-center relative"
                >
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
                        <div className="p-4 text-center text-gray-500">
                          Loading...
                        </div>
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
                                  src={product.images[0]?.url || ""}
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-gray-500">
                                  ${product.price}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <Link
                            href={`/shop?search=${encodeURIComponent(
                              searchQuery
                            )}`}
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
                        <UserAvatar
                          name={user.name || ''}
                          image={user.image || ''}
                          size={32}
                        />
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
                <Link
                  href="/wishlist"
                  className="hover:text-gray-600 hidden sm:block"
                >
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
                      <Link
                        href="/shop?audience=men"
                        className="block text-gray-600"
                      >
                        Men
                      </Link>
                      <Link
                        href="/shop?audience=women"
                        className="block text-gray-600"
                      >
                        Women
                      </Link>
                      <Link
                        href="/shop?audience=kids"
                        className="block text-gray-600"
                      >
                        Kids
                      </Link>
                      <Link
                        href="/shop?audience=unisex"
                        className="block text-gray-600"
                      >
                        Unisex
                      </Link>
                    </div>
                  </div>

                  {/* Featured Section */}
                  <div className="px-4 py-2">
                    <div className="font-medium mb-2">Featured</div>
                    <div className="space-y-2 pl-4">
                      <Link
                        href="/featured?category=new-releases"
                        className="block text-gray-600"
                      >
                        New Releases
                      </Link>
                      <Link
                        href="/featured?category=best-sellers"
                        className="block text-gray-600"
                      >
                        Best Sellers
                      </Link>
                      <Link
                        href="/featured?category=limited-edition"
                        className="block text-gray-600"
                      >
                        Limited Edition
                      </Link>
                      <Link
                        href="/featured?category=collections"
                        className="block text-gray-600"
                      >
                        Collections
                      </Link>
                    </div>
                  </div>

                  {/* Other Links */}
                  <div className="px-4 py-2 space-y-2">
                    <Link href="/about" className="block text-gray-600">
                      About Us
                    </Link>
                    <Link href="/help" className="block text-gray-600">
                      Help
                    </Link>
                    {!user && (
                      <Link
                        href="/auth"
                        className="block text-gray-600 sm:hidden"
                      >
                        Đăng nhập / Đăng ký
                      </Link>
                    )}
                    <Link
                      href="/wishlist"
                      className="block text-gray-600 sm:hidden"
                    >
                      Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
