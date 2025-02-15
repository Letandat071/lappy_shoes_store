"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: Array<{ url: string }>;
  features: string[];
  createdAt: string;
}

interface Feature {
  _id: string;
  name: string;
  description: string;
  icon: string;
  mainImage?: string;
  isActive?: boolean;
  isHighlight: boolean;
}

interface FeatureWithProducts {
  feature: Feature;
  mainProduct?: Product;
  gridProducts: Product[];
}

const CollectionSection = () => {
  const [featuredCollections, setFeaturedCollections] = useState<
    FeatureWithProducts[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuresRes, productsRes] = await Promise.all([
          fetch("/api/admin/features?highlight=true", {
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch("/api/products?limit=100&sort=-createdAt", {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!featuresRes.ok || !productsRes.ok) {
          console.error("Features status:", featuresRes.status);
          console.error("Products status:", productsRes.status);
          const featuresText = await featuresRes.text();
          const productsText = await productsRes.text();
          console.error("Features response:", featuresText);
          console.error("Products response:", productsText);
          throw new Error("Failed to fetch data");
        }

        const featuresData = await featuresRes.json();
        const productsData = await productsRes.json();

        // Debug log để kiểm tra dữ liệu features
        console.log(
          "Fetched features:",
          featuresData.features.map((f) => ({
            name: f.name,
            isHighlight: f.isHighlight,
            isActive: f.isActive,
          }))
        );

        if (!featuresData.features?.length || !productsData.products?.length) {
          console.log("No data available");
          return;
        }

        // Group products by feature
        const productsByFeature = productsData.products.reduce(
          (acc: { [key: string]: Product[] }, product: Product) => {
            if (product.features && product.features.length > 0) {
              product.features.forEach((featureId: string) => {
                const fId =
                  typeof featureId === "object" ? featureId._id : featureId;
                if (!acc[fId]) {
                  acc[fId] = [];
                }
                acc[fId].push(product);
              });
            }
            return acc;
          },
          {}
        );

        // Create collections data
        const collections = featuresData.features
          .filter((feature) => {
            const featureId = feature._id.toString();
            return productsByFeature[featureId]?.length > 0;
          })
          .map((feature: Feature) => {
            const featureId = feature._id.toString();
            const featureProducts = productsByFeature[featureId] || [];
            // console.log(
            //   `Products for feature ${feature.name}:`,
            //   featureProducts
            // );
            const mainProduct = featureProducts[0];
            const gridProducts = featureProducts.slice(1, 7);

            // Sắp xếp sản phẩm theo createdAt để lấy sản phẩm mới nhất
            const sortedProducts = [...featureProducts].sort(
              (a: any, b: any) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              }
            );

            const latestProduct = sortedProducts[0];
            const mainImage =
              latestProduct?.images[0]?.url || "/placeholder-image.jpg";

            return {
              feature: {
                ...feature,
                mainImage,
              },
              mainProduct,
              gridProducts,
            };
          });

        console.log(
          "Filtered collections:",
          collections.map((c) => ({
            name: c.feature.name,
            isHighlight: c.feature.isHighlight,
            productsCount: c.gridProducts.length,
          }))
        );

        if (collections.length > 0) {
          setFeaturedCollections(collections);
        } else {
          console.log("No collections to display");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="py-20 text-center">Loading collections...</div>;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Featured Collections
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Discover our carefully curated collections, featuring the latest
          trends and timeless classics
        </p>

        {featuredCollections.length === 0 ? (
          <div className="text-center py-10">
            <p>No collections available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {featuredCollections
              .filter((collection) => collection.mainProduct)
              .map((collection, index) => (
                <div key={collection.feature._id} className="relative">
                  {/* Collection Title Overlay */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-lg z-10">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold">
                        {collection.feature.name}
                      </h3>
                      {collection.feature.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {collection.feature.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Main Image */}
                    {collection.mainProduct && (
                      <div className="lg:col-span-6 relative h-[500px] overflow-hidden rounded-lg">
                        <Image
                          src={collection.feature.mainImage}
                          alt={collection.mainProduct.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300">
                          <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white text-lg mb-4">
                              {collection.feature.description}
                            </p>
                            <Link
                              href={`/shop?feature=${collection.feature._id}`}
                              className="inline-block bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              Explore Collection
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grid Images */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[160px]">
                      {collection.gridProducts.map((product, imgIndex) => (
                        <Link
                          href={`/product/${product._id}`}
                          key={product._id}
                          className={`relative overflow-hidden rounded-lg group ${
                            imgIndex === 0
                              ? "md:col-span-2 md:row-span-2 md:h-[336px]"
                              : "h-[160px]"
                          }`}
                        >
                          <Image
                            src={
                              product.images[0]?.url || "/placeholder-image.jpg"
                            }
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes={
                              imgIndex === 0
                                ? "(max-width: 768px) 100vw, 33vw"
                                : "(max-width: 768px) 50vw, 16.67vw"
                            }
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h4 className="text-white text-lg font-semibold text-center px-4">
                              {product.name}
                            </h4>
                            <p className="text-yellow-400 font-bold mt-2">
                              ${product.price}
                            </p>
                            <button className="mt-4 bg-white text-black px-6 py-2 rounded-full text-sm hover:bg-yellow-400 transition-colors">
                              Quick View
                            </button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;
