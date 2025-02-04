"use client";

import React, {
  Suspense,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { useProducts } from "@/hooks/useProducts";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useWishlist } from "@/hooks/useWishlist";

type FilterValue = string | number | string[] | { min: number; max: number };

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  sizes: string[];
  colors: string[];
  sort: string;
  feature: string;
  audience: string;
  [key: string]: FilterValue | FilterValue[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    color?: string;
    version?: string;
  }>;
  category: {
    _id: string;
    name: string;
  };
  brand: string;
  colors: string[];
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
  rating?: number;
  reviewCount?: number;
  discount?: number;
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Thêm state cho filters
  const [localFilters, setLocalFilters] = useState({
    categories: searchParams.get("category")
      ? [searchParams.get("category")!]
      : [],
    brands: searchParams.get("brand") ? [searchParams.get("brand")!] : [],
    feature: searchParams.get("feature") || "",
    audience: searchParams.get("audience") || "",
    search: searchParams.get("search") || "",
    priceRange: { min: 0, max: 10000000 },
    sort: "-createdAt",
    sizes: [] as string[],
    colors: [] as string[],
  });

  // Sử dụng localFilters thay vì tạo filters từ URL
  const filters = useMemo(
    () => ({
      page,
      limit: 12,
      ...localFilters,
      enabled: true,
    }),
    [page, localFilters]
  );

  // Xử lý filter change không dùng URL
  const handleFilterChange = useCallback(
    (filterType: string, value: FilterValue) => {
      if (filterType === "clear") {
        setLocalFilters({
          categories: [],
          brands: [],
          feature: "",
          audience: "",
          search: "",
          priceRange: { min: 0, max: 10000000 },
          sort: "-createdAt",
          sizes: [],
          colors: [],
        });
        return;
      }

      setLocalFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    },
    []
  );

  // Sử dụng trực tiếp object filters
  const { products, loading, error, pagination } = useProducts(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalFilters((prev) => ({
      ...prev,
      search: searchQuery.trim(),
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setLocalFilters((prev) => ({
        ...prev,
        search: value.trim(),
      }));
    }, 500);
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setLocalFilters((prev) => ({
      ...prev,
      search: term,
    }));
  };

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Thêm hàm filterProducts
  const filterProducts = (products: Product[]) => {
    return products.filter((product) => {
      // Tính tổng số lượng sản phẩm bằng cách cộng tất cả các quantity của từng size
      const totalQuantity =
        product.sizes?.reduce((acc, s) => acc + s.quantity, 0) ?? 0;
      // Nếu có status "out-of-stock" hoặc tổng số lượng bằng 0 thì không hiển thị sản phẩm
      if ((product as any).status === "out-of-stock" || totalQuantity === 0) {
        return false;
      }

      // Lọc theo categories
      if (
        localFilters.categories.length > 0 &&
        !localFilters.categories.includes(product.category._id)
      ) {
        return false;
      }

      // Lọc theo brand
      if (
        localFilters.brands.length > 0 &&
        !localFilters.brands.includes(product.brand)
      ) {
        return false;
      }

      // Lọc theo màu sắc
      if (localFilters.colors.length > 0) {
        const productColors = product.colors || [];
        const hasMatchingColor = localFilters.colors.some((color) =>
          productColors.some((productColor) =>
            productColor.toLowerCase().includes(color.toLowerCase())
          )
        );
        if (!hasMatchingColor) return false;
      }

      // Lọc theo size
      if (localFilters.sizes.length > 0) {
        const productSizes = product.sizes?.map((s) => s.size) || [];
        const hasMatchingSize = localFilters.sizes.some((size) =>
          productSizes.includes(size)
        );
        if (!hasMatchingSize) return false;
      }

      return true;
    });
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <main>
        <Navbar />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 mb-8 pt-32">
          <nav className="flex text-gray-500 text-sm">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">Shop</span>
          </nav>
        </div>

        {/* Search Results Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">All Products</h1>
              {pagination && (
                <p className="text-gray-600">
                  {pagination.total} results found
                </p>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black pr-12"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <i className="fas fa-search text-lg"></i>
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Popular:</span>
              <button
                onClick={() => handlePopularSearch("Running Shoes")}
                className="text-sm text-gray-600 hover:text-black"
              >
                Running Shoes
              </button>
              <button
                onClick={() => handlePopularSearch("Basketball")}
                className="text-sm text-gray-600 hover:text-black"
              >
                Basketball
              </button>
              <button
                onClick={() => handlePopularSearch("Lifestyle")}
                className="text-sm text-gray-600 hover:text-black"
              >
                Lifestyle
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <FilterSidebar
              selectedFilters={localFilters}
              onFilterChange={(filterType, value) => {
                if (filterType === "sort") {
                  setLocalFilters((prev) => ({
                    ...prev,
                    sort: value as string,
                  }));
                } else {
                  handleFilterChange(filterType, value);
                }
              }}
            />

            {/* Results Grid */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Lỗi Khi tải sản phẩm
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Có thể sản phẩm của bạn không tồn tại hoặc đã bị xóa
                  </p>
                  {/* <p className="text-gray-600 mb-8">{error}</p> */}
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filterProducts(products).map((product) => (
                        <div
                          key={product._id}
                          className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {/* Image Container */}
                          <div className="relative aspect-square">
                            <Link href={`/product/${product._id}`}>
                              <div className="relative h-full overflow-hidden">
                                <Image
                                  src={
                                    product.images[0]?.url ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay khi hover */}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </Link>

                            {/* Tags Container */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2">
                              {product.discount && product.discount > 0 && (
                                <div className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                                  -{product.discount}%
                                </div>
                              )}
                            </div>

                            {/* Wishlist Button */}
                            <button
                              onClick={() => {
                                if (isInWishlist(product._id)) {
                                  removeFromWishlist(product._id);
                                } else {
                                  addToWishlist({
                                    _id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    image: product.images[0]?.url || "",
                                    sizes: product.sizes
                                      ? product.sizes.map(
                                          (s: {
                                            size: string;
                                            quantity: number;
                                          }) => s.size
                                        )
                                      : [],
                                    stock: {},
                                  });
                                }
                              }}
                              className={`absolute top-2 left-2 w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                                isInWishlist(product._id)
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                              title={
                                isInWishlist(product._id)
                                  ? "Xóa khỏi yêu thích"
                                  : "Thêm vào yêu thích"
                              }
                            >
                              <i
                                className={`fas fa-heart ${
                                  isInWishlist(product._id)
                                    ? "text-white"
                                    : "text-red-500"
                                }`}
                              ></i>
                            </button>
                          </div>

                          {/* Product Info */}
                          <Link href={`/product/${product._id}`}>
                            <div className="p-4">
                              {/* Category */}
                              <div className="text-xs text-gray-500 mb-1">
                                {product.category.name}
                              </div>

                              {/* Product Name */}
                              <h3 className="font-medium text-gray-800 group-hover:text-black transition-colors mb-2 truncate">
                                {product.name}
                              </h3>

                              {/* Rating */}
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < (product.rating || 0)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({product.reviewCount || 0})
                                </span>
                              </div>

                              {/* Price Section */}
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.price)}
                                </span>
                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(product.originalPrice)}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">
                        Không tìm thấy sản phẩm
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Vui lòng thử lại với các từ khóa khác hoặc kiểm tra lại
                        các filter
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`px-4 py-2 border rounded-lg ${
                            page === i + 1
                              ? "bg-black text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setPage(Math.min(pagination.totalPages, page + 1))
                        }
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}

                  {/* Cập nhật hiển thị số lượng sản phẩm */}
                  {pagination && (
                    <p className="text-gray-600">
                      {filterProducts(products).length} kết quả từ{" "}
                      {pagination.total} sản phẩm
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </Suspense>
  );
}
