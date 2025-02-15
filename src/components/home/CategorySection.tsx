"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isHighlight?: boolean;
  latestProductImage?: string;
  productCount?: number;
  isActive?: boolean;
}

interface ProductData {
  _id: string;
  category: {
    _id: string;
  };
  images: Array<{
    url: string;
  }>;
}

interface CategoryWithImage extends Category {
  latestProductImage?: string;
  productCount?: number;
}

interface ProductsByCategoryMap {
  [key: string]: ProductData[];
}

const CategorySection = () => {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);
  const dataFetched = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (dataFetched.current) return;

    const fetchData = async () => {
      try {
        // Luôn xóa cache để lấy dữ liệu mới nhất
        sessionStorage.removeItem("categoryData");

        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/products?limit=1000"),
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [categoriesData, productsData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
        ]);

        // Log để debug
        // console.log("Raw categories data:", categoriesData);

        const productsByCategory = productsData.products.reduce(
          (acc: ProductsByCategoryMap, product: ProductData) => {
            const categoryId = product.category._id;
            if (!acc[categoryId]) {
              acc[categoryId] = [];
            }
            acc[categoryId].push(product);
            return acc;
          },
          {} as ProductsByCategoryMap
        );

        const categoriesWithData = categoriesData.categories
          .filter((category: Category) => category.isActive !== false) // Lọc các category active
          .map((category: Category): CategoryWithImage => {
            const categoryProducts = productsByCategory[category._id] || [];
            return {
              ...category,
              latestProductImage:
                categoryProducts[0]?.images[0]?.url || "/placeholder-image.jpg",
              productCount: categoryProducts.length,
            };
          });

        // Log để debug
        // console.log("Processed categories:", categoriesWithData);

        setCategories(categoriesWithData);
        setProductCounts(
          categoriesWithData.reduce(
            (acc: { [key: string]: number }, cat: CategoryWithImage) => ({
              ...acc,
              [cat._id]: cat.productCount || 0,
            }),
            {}
          )
        );

        dataFetched.current = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-2">Loading categories...</p>
        </div>
      </div>
    );
  }

  const sortedCategories = categories.sort((a, b) => {
    if (a.isHighlight && !b.isHighlight) return -1;
    if (!a.isHighlight && b.isHighlight) return 1;
    return 0;
  });

  // Log để debug
  // console.log(
  //   "All categories with isHighlight:",
  //   categories.map((c) => ({
  //     name: c.name,
  //     isHighlight: c.isHighlight,
  //   }))
  // );

  // Lọc chỉ lấy các category được highlight và active
  const highlightedCategories = sortedCategories.filter(
    (category) => category.isHighlight === true && category.isActive !== false
  );

  // console.log("Highlighted categories:", highlightedCategories);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {highlightedCategories.length > 0
            ? "Featured Categories"
            : "Shop by Category"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(highlightedCategories.length > 0
            ? highlightedCategories
            : sortedCategories.filter((cat) => cat.isActive !== false)
          ).map((category) => (
            <div key={category._id} className="relative group">
              <Link
                href={`/shop?category=${category._id}`}
                className={`block ${
                  category.isHighlight ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                  <Image
                    src={
                      category.latestProductImage ?? "/placeholder-image.jpg"
                    }
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-xl font-bold mb-2">
                        {category.name}
                        {category.isHighlight && (
                          <span className="ml-2 text-sm bg-blue-500 px-2 py-1 rounded">
                            Nổi bật
                          </span>
                        )}
                      </h3>
                      <p className="text-sm opacity-90">
                        {productCounts[category._id] || 0} Products
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
