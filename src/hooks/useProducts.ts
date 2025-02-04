import { useState, useEffect, useMemo } from 'react';

interface ProductImage {
  url: string;
  color?: string;
  version?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: ProductImage[];
  category: {
    _id: string;
    name: string;
  };
  features: Array<{
    _id: string;
    name: string;
    icon: string;
  }>;
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
  colors: string[];
  status: string;
  rating?: number;
  reviewCount?: number;
  totalQuantity: number;
  brand: string;
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseProductsParams {
  page?: number;
  limit?: number;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  feature?: string;
  audience?: string;
  enabled?: boolean;
  priceRange?: { min: number; max: number };
}

export function useProducts(params: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Tạo queryString ổn định
  const queryString = useMemo(() => {
    const queryParams = new URLSearchParams();
    
    // Chỉ thêm các params thực sự cần thiết và có giá trị
    queryParams.set("page", params.page?.toString() || "1");
    queryParams.set("limit", params.limit?.toString() || "10");
    queryParams.set("sort", params.sort || "-createdAt");

    if (params.search?.trim()) queryParams.set("search", params.search.trim());
    if (params.categories?.length) queryParams.set("category", params.categories[0]);
    if (params.brands?.length) queryParams.set("brand", params.brands[0]);
    if (params.feature) queryParams.set("feature", params.feature);
    if (params.audience) queryParams.set("audience", params.audience);
    if (params.priceRange?.min > 0) queryParams.set("minPrice", params.priceRange.min.toString());
    if (params.priceRange?.max < 10000000) queryParams.set("maxPrice", params.priceRange.max.toString());

    return queryParams.toString();
  }, [params]);

  useEffect(() => {
    if (!params.enabled) return;

    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/products?${queryString}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
        
        if (isMounted) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [queryString, params.enabled]); // Chỉ phụ thuộc vào queryString và enabled

  return { products, loading, error, pagination };
} 