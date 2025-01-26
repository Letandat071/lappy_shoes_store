'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { useCartContext } from '@/contexts/CartContext';
import { useWishlistContext } from '@/contexts/WishlistContext';
import { Feature } from '../../../types/feature';
import { Category } from '../../../types/category';
import ProductsReview from '@/components/product/ProductsReview';
import ProductSuggest from '@/components/product/ProductSuggest';

interface Image {
  url: string;
  color?: string;
  version?: string;
}

interface Size {
  size: string;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: Image[];
  sizes: Size[];
  category: Category;
  features: Feature[];
}

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN');
};

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  const { addToCart } = useCartContext();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistContext();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const updateQuantity = (change: number) => {
    if (product && selectedSize) {
      const selectedSizeObj = product.sizes.find(s => s.size === selectedSize);
      if (selectedSizeObj) {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= selectedSizeObj.quantity) {
          setQuantity(newQuantity);
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast.error('Vui lòng chọn size');
      return;
    }

    const selectedSizeObj = product.sizes.find(s => s.size === selectedSize);
    if (!selectedSizeObj) {
      toast.error('Size không hợp lệ');
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      size: selectedSize,
      quantity: quantity,
      stock: selectedSizeObj.quantity
    });
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0].url,
        sizes: product.sizes.map(s => s.size),
        stock: Object.fromEntries(product.sizes.map(s => [s.size, s.quantity]))
      });
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
            <Link href="/shop" className="text-blue-600 hover:underline">
              Quay lại cửa hàng
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-black">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/shop" className="text-gray-500 hover:text-black">
            Cửa hàng
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg">
              {selectedImage && selectedImage.url && (
                <Image 
                  src={selectedImage.url}
                  alt={product?.name || 'Product image'}
                  width={500}
                  height={500}
                  className="w-full h-[500px] object-contain"
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product?.images.map((image, index) => (
                image.url && (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`bg-white rounded-lg p-4 border-2 ${
                      selectedImage === image ? 'border-black' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <Image 
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-20 object-contain"
                    />
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-600">Danh mục: {product.category.name}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-green-500">Còn hàng</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">{formatPrice(product.price)}₫</span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-xl">{formatPrice(product.originalPrice)}₫</span>
                    <span className="bg-red-100 text-red-500 px-2 py-1 rounded text-sm">
                      Giảm {product.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Size Options */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Chọn Size</h3>
                <button className="text-gray-600 hover:text-black text-sm">Hướng dẫn chọn size</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    className={`py-2 border-2 rounded-lg transition-colors ${
                      selectedSize === sizeObj.size
                        ? 'bg-black text-white border-black'
                        : sizeObj.quantity > 0 
                          ? 'border-gray-300 hover:border-black'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={sizeObj.quantity === 0}
                  >
                    {sizeObj.size}
                    {sizeObj.quantity === 0 && <span className="block text-xs">Hết hàng</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 rounded-lg">
                <button 
                  className="px-4 py-2 hover:bg-gray-100" 
                  onClick={() => updateQuantity(-1)}
                  disabled={!selectedSize}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  min="1" 
                  className="w-16 text-center border-x-2"
                  readOnly
                />
                <button 
                  className="px-4 py-2 hover:bg-gray-100" 
                  onClick={() => updateQuantity(1)}
                  disabled={!selectedSize}
                >
                  +
                </button>
              </div>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button 
                variant="outline" 
                className="w-12 h-12 flex items-center justify-center p-0"
                onClick={toggleWishlist}
              >
                <i className={`fas fa-heart ${isInWishlist(product._id) ? 'text-red-500' : ''}`}></i>
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-4">Mô tả sản phẩm</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Tính năng</h3>
                <ul className="list-disc list-inside space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ProductsReview productId={product._id} />

        {/* Related Products */}
        <ProductSuggest categoryId={product.category._id} currentProductId={product._id} />
      </div>
      <Footer />
    </main>
  );
};

export default ProductPage; 