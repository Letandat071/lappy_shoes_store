import React from "react";
import Image from "next/image";
import { formatPrice } from "@/utils/format";

interface WishlistItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  name,
  price,
  image,
  inStock = true,
  onRemove,
  onAddToCart,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="rounded-md"
        />
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-600">{formatPrice(price)}đ</p>
          <p
            className={`text-sm ${inStock ? "text-green-600" : "text-red-600"}`}
          >
            {inStock ? "Còn hàng" : "Hết hàng"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onAddToCart(id)}
          disabled={!inStock}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Thêm vào giỏ hàng
        </button>
        <button
          onClick={() => onRemove(id)}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;

const WISHLIST_KEY_PREFIX = "user_wishlist_";

export const getWishlistKey = (userId: string) => {
  return `${WISHLIST_KEY_PREFIX}${userId}`;
};

export const getUserWishlist = (userId: string) => {
  if (typeof window === "undefined") return [];
  const key = getWishlistKey(userId);
  const wishlist = localStorage.getItem(key);
  return wishlist ? JSON.parse(wishlist) : [];
};

export interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
}

export const saveUserWishlist = (
  userId: string,
  wishlist: WishlistProduct[]
) => {
  const key = getWishlistKey(userId);
  localStorage.setItem(key, JSON.stringify(wishlist));
};
