import { useState, useEffect } from 'react';

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

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  brand?: string;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  feature?: string;
  audience?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: options.page?.toString() || '1',
          limit: options.limit?.toString() || '10',
          ...(options.category && { category: options.category }),
          ...(options.minPrice && { minPrice: options.minPrice?.toString() }),
          ...(options.maxPrice && { maxPrice: options.maxPrice?.toString() }),
          ...(options.search && { search: options.search }),
          ...(options.sort && { sort: options.sort }),
          ...(options.brand && { brand: options.brand }),
          ...(options.brands?.length && { brands: options.brands.join(',') }),
          ...(options.sizes?.length && { sizes: options.sizes.join(',') }),
          ...(options.colors?.length && { colors: options.colors.join(',') }),
          ...(options.feature && { feature: options.feature }),
          ...(options.audience && { audience: options.audience })
        });

        const res = await fetch(`/api/products?${queryParams}`);
        const data = await res.json();
        
        console.log("API Response:", {
          status: res.status,
          ok: res.ok,
          data
        });
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
        
        if (isMounted) {
          setProducts(data.products);
          setPagination(data.pagination);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [
    options.page,
    options.limit,
    options.category,
    options.minPrice,
    options.maxPrice,
    options.search,
    options.sort,
    options.brand,
    options.brands,
    options.sizes,
    options.colors,
    options.feature,
    options.audience
  ]);

  return { products, loading, error, pagination };
} 