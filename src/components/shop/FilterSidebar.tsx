"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type FilterValue = string | number | string[] | { min: number; max: number };

interface Category {
  _id: string;
  name: string;
}

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  sizes: string[];
  colors: string[];
  sort?: string;
  audience?: string;
  feature?: string;
  [key: string]: FilterValue | FilterValue[] | undefined;
}

interface FilterSidebarProps {
  selectedFilters: Filters;
  onFilterChange: (filterType: string, value: FilterValue) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [features, setFeatures] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasFetched) {
      const fetchFilters = async () => {
        try {
          const [categoriesRes, productsRes, featuresRes] = await Promise.all([
            fetch("/api/admin/categories"),
            fetch("/api/products?limit=1000"),
            fetch("/api/admin/features"),
          ]);

          const [categoriesData, productsData, featuresData] =
            await Promise.all([
              categoriesRes.json(),
              productsRes.json(),
              featuresRes.json(),
            ]);

          if (categoriesData.categories) {
            setCategories(categoriesData.categories);
          }

          if (productsData.products) {
            const uniqueBrands = Array.from(
              new Set(
                productsData.products.map((p: { brand: string }) => p.brand)
              )
            ).filter(Boolean) as string[];
            setBrands(uniqueBrands);
          }

          if (featuresData.features) {
            setFeatures(featuresData.features);
          }
        } catch (error) {
          console.error("Error fetching filters:", error);
        } finally {
          setLoading(false);
          setHasFetched(true);
        }
      };

      fetchFilters();
    }
  }, [hasFetched]);

  const handlePriceChange = (value: number) => {
    onFilterChange("priceRange", {
      min: 0,
      max: value,
    });
  };

  const handleColorSelect = (color: string) => {
    const currentColors = selectedFilters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    onFilterChange("colors", newColors);
  };

  const handleSizeSelect = (size: string) => {
    const currentSizes = selectedFilters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    onFilterChange("sizes", newSizes);
  };

  const handleBrandSelect = (brand: string) => {
    const currentBrands = selectedFilters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onFilterChange("brands", newBrands);
  };

  const handleCategorySelect = (categoryId: string) => {
    const currentCategories = selectedFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((c) => c !== categoryId)
      : [...currentCategories, categoryId];
    onFilterChange("categories", newCategories);
  };

  const handleAudienceSelect = (audience: string) => {
    onFilterChange("audience", audience);
  };

  const handleFeatureSelect = (featureId: string) => {
    onFilterChange("feature", featureId);
  };

  const handleClearAllFilters = () => {
    router.push("/shop", { scroll: true });
    onFilterChange("clear", "");
  };

  // Tạo danh sách brands được hiển thị
  const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);

  if (loading) {
    return (
      <div className="lg:w-1/4">
        <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-4 mb-8">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={handleClearAllFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <input
            type="range"
            min="0"
            max="10000000"
            step="100000"
            value={selectedFilters.priceRange.max}
            className="w-full"
            onChange={(e) => handlePriceChange(Number(e.target.value))}
          />
          <div className="flex justify-between mt-2">
            <span>{selectedFilters.priceRange.min.toLocaleString()}đ</span>
            <span>{selectedFilters.priceRange.max.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {["Trắng", "Đen", "Xanh", "Đỏ", "Vàng", "Xám"].map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`px-3 py-1 rounded-full border ${
                  selectedFilters.colors.includes(color)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Sizes</h3>
          <div className="grid grid-cols-4 gap-2">
            {["36", "37", "38", "39", "40", "41", "42", "43"].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`px-3 py-2 border rounded ${
                  selectedFilters.sizes.includes(size)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Brands</h3>
          <div className="space-y-2">
            {visibleBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedFilters.brands.includes(brand)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{brand}</span>
                  {selectedFilters.brands.includes(brand) && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}

            {/* Show More/Less Button */}
            {brands.length > 5 && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="w-full mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1"
              >
                {showAllBrands ? (
                  <>
                    Thu gọn
                    <i className="fas fa-chevron-up text-xs"></i>
                  </>
                ) : (
                  <>
                    Xem thêm ({brands.length - 5})
                    <i className="fas fa-chevron-down text-xs"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category._id)}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedFilters.categories.includes(category._id)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  {selectedFilters.categories.includes(category._id) && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Shop/Audience Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <div className="space-y-2">
            {["Men", "Women", "Kids", "Unisex"].map((audience) => (
              <button
                key={audience}
                onClick={() => handleAudienceSelect(audience)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedFilters.audience?.toLowerCase() ===
                  audience.toLowerCase()
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{audience}</span>
                  {selectedFilters.audience?.toLowerCase() ===
                    audience.toLowerCase() && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="space-y-2">
            {features.map((feature) => (
              <button
                key={feature._id}
                onClick={() => handleFeatureSelect(feature._id)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedFilters.feature === feature._id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{feature.name}</span>
                  {selectedFilters.feature === feature._id && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Sort By</h3>
          <select
            onChange={(e) => onFilterChange("sort", e.target.value)}
            className="w-full border rounded-lg p-2"
            value={selectedFilters.sort || "-createdAt"}
          >
            <option value="-createdAt">Mới nhất</option>
            <option value="price">Giá: Thấp đến cao</option>
            <option value="-price">Giá: Cao đến thấp</option>
            <option value="-rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
