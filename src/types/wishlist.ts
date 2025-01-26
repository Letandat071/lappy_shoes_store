export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  stock: Record<string, number>;
}

export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
} 