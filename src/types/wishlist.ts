export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  stock: Record<string, number>;
  rating?: number;
  reviewCount?: number;
  category?: string;
}

export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
} 