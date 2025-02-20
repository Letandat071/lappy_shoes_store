import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CACHE_DURATION = {
  short: 60, // 1 phút
  medium: 300, // 5 phút
  long: 3600, // 1 giờ
  day: 86400, // 1 ngày
};

// Routes cần cache và thời gian cache tương ứng
const CACHE_ROUTES = new Map([
  ['/api/products', CACHE_DURATION.medium],
  ['/api/categories', CACHE_DURATION.long],
  ['/api/features', CACHE_DURATION.long],
  ['/api/banner', CACHE_DURATION.medium],
  ['/api/announcements', CACHE_DURATION.short],
]);

// Cache key generator
const generateCacheKey = (request: NextRequest) => {
  const url = new URL(request.url);
  return `${url.pathname}${url.search}`;
};

// Cache response
export async function cacheResponse(request: NextRequest, response: Response) {
  const cacheKey = generateCacheKey(request);
  const cacheDuration = CACHE_ROUTES.get(new URL(request.url).pathname);

  if (!cacheDuration) return response;

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', `s-maxage=${cacheDuration}, stale-while-revalidate`);

  const clonedResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });

  return clonedResponse;
}

// Check if route should be cached
export function shouldCache(request: NextRequest): boolean {
  if (request.method !== 'GET') return false;
  
  const pathname = new URL(request.url).pathname;
  return CACHE_ROUTES.has(pathname);
}

// Invalidate cache for specific routes
export async function invalidateCache(routes: string[]) {
  // Implement cache invalidation logic here
  // This could involve Redis, Memcached, or other caching solutions
  console.log('Cache invalidated for routes:', routes);
} 