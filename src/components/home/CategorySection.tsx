"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
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
        const cachedData = sessionStorage.getItem("categoryData");
        if (cachedData) {
          const { categories: cachedCategories, counts: cachedCounts } =
            JSON.parse(cachedData);
          setCategories(cachedCategories);
          setProductCounts(cachedCounts);
          setLoading(false);
          return;
        }

        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/products?limit=1000"),
        ]);

        console.log("Categories status:", categoriesRes.status);
        console.log("Products status:", productsRes.status);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [categoriesData, productsData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
        ]);

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

        const categoriesWithData = categoriesData.categories.map(
          (category: Category): CategoryWithImage => {
            const categoryProducts = productsByCategory[category._id] || [];
            return {
              ...category,
              latestProductImage:
                categoryProducts[0]?.images[0]?.url || "/placeholder-image.jpg",
              productCount: categoryProducts.length,
            };
          }
        );

        const counts = categoriesWithData.reduce(
          (acc: { [key: string]: number }, cat: CategoryWithImage) => ({
            ...acc,
            [cat._id]: cat.productCount || 0,
          }),
          {}
        );

        if (isMounted.current) {
          setCategories(categoriesWithData);
          setProductCounts(counts);

          sessionStorage.setItem(
            "categoryData",
            JSON.stringify({
              categories: categoriesWithData,
              counts: counts,
              timestamp: Date.now(),
            })
          );

          dataFetched.current = true;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
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

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shop?category=${category._id}`}
              className="group"
            >
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                <Image
                  src={category.latestProductImage ?? "/placeholder-image.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">
                      {productCounts[category._id] || 0} Products
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
