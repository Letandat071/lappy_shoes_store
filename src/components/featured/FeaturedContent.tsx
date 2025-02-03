"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCartContext } from "@/contexts/CartContext";
import { useWishlistContext } from "@/contexts/WishlistContext";

interface Feature {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  images: Array<{
    url: string;
    color?: string;
    version?: string;
  }>;
  category: {
    _id: string;
    name: string;
  };
  discount?: number;
  sizes?: string[];
}

const FeaturedContent = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const searchParams = useSearchParams();
  const selectedFeature = searchParams.get("feature");
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlistContext();

  // Fetch features
  useEffect(() => {
    async function fetchFeatures() {
      try {
        const response = await fetch("/api/admin/features");
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu features");
        }
        const data = await response.json();
        setFeatures(data.features || []);
      } catch (error) {
        console.error("Error fetching features:", error);
        toast.error("Không thể tải dữ liệu tính năng");
      }
    }
    fetchFeatures();
  }, []);

  // Fetch products by feature
  useEffect(() => {
    async function fetchProducts() {
      if (!selectedFeature) {
        setProducts([]);
        return;
      }

      setProductsLoading(true);
      try {
        const response = await fetch(
          `/api/products?feature=${encodeURIComponent(selectedFeature)}`
        );
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
      } finally {
        setProductsLoading(false);
      }
    }
    fetchProducts();
  }, [selectedFeature]);

  // Lấy ảnh banner từ sản phẩm mới nhất
  const getFeatureBanner = () => {
    if (products.length > 0 && products[0].images.length > 0) {
      return products[0].images[0].url;
    }
    return "/placeholder-banner.jpg"; // Ảnh mặc định
  };

  return (
    <main className="pt-32">
      {/* Feature Banner & Description */}
      {selectedFeature && (
        <div className="max-w-7xl mx-auto px-4 mb-2">
          {/* Banner */}
          <div className="relative h-[200px] w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src={getFeatureBanner()}
              alt={selectedFeature}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">{selectedFeature}</h2>
                {features.map((feature) => {
                  if (feature.name === selectedFeature && feature.description) {
                    return (
                      <p
                        key={feature._id}
                        className="text-lg max-w-2xl mx-auto"
                      >
                        {feature.description}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Product Count */}
          {!productsLoading && (
            <div className="text-center mb-2">
              <p className="text-gray-600">
                {products.length} sản phẩm thuộc bộ sưu tập {selectedFeature}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Features Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h1 className="text-3xl font-bold mb-8">Bộ sưu tập</h1>
        <div className="flex flex-wrap gap-4">
          {features.map((feature) => (
            <Link
              key={feature._id}
              href={`/featured?feature=${encodeURIComponent(feature.name)}`}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-colors
                ${
                  selectedFeature === feature.name
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {feature.icon && <span>{feature.icon}</span>}
              <span>{feature.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                          product.images[0]?.url || "/placeholder-product.jpg"
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
                        toast.success("Đã xóa khỏi danh sách yêu thích");
                      } else {
                        addToWishlist({
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.images[0]?.url || "",
                          sizes: product.sizes || [],
                          stock: {},
                        });
                        toast.success("Đã thêm vào danh sách yêu thích");
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
        ) : selectedFeature ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Không có sản phẩm nào
            </h3>
            <p className="text-gray-500">
              Hiện chưa có sản phẩm nào trong bộ sưu tập này
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-hand-pointer"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Chọn một bộ sưu tập
            </h3>
            <p className="text-gray-500">
              Vui lòng chọn một bộ sưu tập để xem các sản phẩm
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default FeaturedContent;
