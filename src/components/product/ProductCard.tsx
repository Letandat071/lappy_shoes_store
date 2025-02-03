import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "@/utils/format";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  rating = 0,
  reviewCount = 0,
  image,
  discount,
}) => {
  return (
    <Link href={`/product/${id}`} className="group">
      <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Product Image */}
        <div className="relative group">
          <Image
            src={image || "/placeholder-product.jpg"}
            alt={name}
            width={400}
            height={400}
            className="w-full aspect-square object-cover rounded-xl"
          />
          {discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              -{discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4">
          <h3 className="font-medium mb-1">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatPrice(price)}đ</span>
            {originalPrice && (
              <span className="text-gray-500 line-through">
                {formatPrice(originalPrice)}đ
              </span>
            )}
          </div>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">({reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
