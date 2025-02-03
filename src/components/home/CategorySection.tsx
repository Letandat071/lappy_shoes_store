"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryWithImage extends Category {
  latestProductImage?: string;
}

const CategorySection = () => {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/admin/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!categoriesRes.ok) {
          throw new Error(`Categories API error: ${categoriesRes.statusText}`);
        }

        const categoriesData = await categoriesRes.json();

        // Fetch latest product image for each category
        const categoriesWithImages = await Promise.all(
          categoriesData.categories.map(async (category: Category) => {
            try {
              const productRes = await fetch(
                `/api/products?categoryId=${category._id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!productRes.ok) {
                console.warn(
                  `Failed to fetch products for category ${category._id}`
                );
                return {
                  ...category,
                  latestProductImage: "/placeholder-image.jpg",
                };
              }

              const productData = await productRes.json();
              return {
                ...category,
                latestProductImage:
                  productData.product?.images?.[0]?.url ||
                  "/placeholder-image.jpg",
              };
            } catch (error) {
              console.warn(
                `Error fetching product for category ${category._id}:`,
                error
              );
              return {
                ...category,
                latestProductImage: "/placeholder-image.jpg",
              };
            }
          })
        );

        // Fetch all products for counts
        const productsRes = await fetch("/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!productsRes.ok) {
          throw new Error(`Products API error: ${productsRes.statusText}`);
        }

        const productsData = await productsRes.json();

        // Calculate product counts per category
        const counts: { [key: string]: number } = {};
        categoriesData.categories.forEach((cat: Category) => {
          const categoryProducts = productsData.products.filter(
            (product: any) => product.category?._id === cat._id
          );
          counts[cat._id] = categoryProducts.length;
        });

        setCategories(categoriesWithImages);
        setProductCounts(counts);
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
              href={`/category/${category.slug}`}
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
