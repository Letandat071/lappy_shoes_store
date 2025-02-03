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
}

export function useProducts({
  page = 1,
  limit = 10,
  ...filters
}: UseProductsParams) {
  // Add console.log to track when hook is called
  console.log('useProducts called with:', { page, limit, ...filters });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Combine all filters into one object
  const filterParams = useMemo(() => {
    console.log('Filter values:', Object.values(filters));
    const {
      categories,
      minPrice,
      maxPrice,
      search,
      sort,
      brands,
      sizes,
      colors,
      feature,
      audience
    } = filters;
    
    return {
      page,
      limit,
      categories,
      minPrice,
      maxPrice,
      search,
      sort,
      brands,
      sizes,
      colors,
      feature,
      audience
    };
  }, [
    page,
    limit,
    filters.categories,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
    filters.sort,
    filters.brands,
    filters.sizes,
    filters.colors,
    filters.feature,
    filters.audience
  ]);

  useEffect(() => {
    console.log('useEffect triggered with filterParams:', filterParams);
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: filterParams.page.toString(),
          limit: filterParams.limit.toString(),
          sort: filterParams.sort || "-createdAt",
          ...(filterParams.minPrice && { minPrice: filterParams.minPrice.toString() }),
          ...(filterParams.maxPrice && { maxPrice: filterParams.maxPrice.toString() }),
          ...(filterParams.search && { search: filterParams.search }),
          ...(filterParams.brands && { brands: filterParams.brands.join(',') }),
          ...(filterParams.sizes && { sizes: filterParams.sizes.join(',') }),
          ...(filterParams.colors && { colors: filterParams.colors.join(',') }),
          ...(filterParams.feature && { feature: filterParams.feature }),
          ...(filterParams.audience && { audience: filterParams.audience })
        });

        if (filterParams.categories && filterParams.categories.length > 0) {
          filterParams.categories.forEach(cat => queryParams.append("categories[]", cat));
        }

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
  }, [filterParams]); // Chỉ một dependency

  return { products, loading, error, pagination };
} 