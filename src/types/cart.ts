export interface CartItem {
  _id: string;      // ID của sản phẩm trong giỏ hàng
  productId: string; // ID của sản phẩm trong database
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock: number;
  originalPrice?: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
} 