import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// Các routes cần xác thực
const protectedRoutes = [
  '/profile',
  '/orders',
  '/wishlist',
  '/cart',
];

// Các routes admin cần xác thực
const adminRoutes = ['/admin'];

// Các routes chỉ cho phép truy cập khi chưa đăng nhập
const authRoutes = ['/auth'];

// Các routes admin chỉ cho phép truy cập khi chưa đăng nhập
const adminAuthRoutes = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Xử lý admin routes
  if (pathname.startsWith('/admin')) {
    try {
      if (adminToken) {
        // Verify admin token
        const { payload } = await jose.jwtVerify(adminToken, JWT_SECRET);
        
        // Nếu đã đăng nhập và cố truy cập trang login
        if (adminAuthRoutes.some(route => pathname.startsWith(route))) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
        
        return NextResponse.next();
      }

      // Nếu chưa đăng nhập và cố truy cập admin routes (trừ login)
      if (!adminAuthRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Token không hợp lệ
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Xử lý user routes
  try {
    if (token) {
      // Verify token
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      // Nếu đã đăng nhập và cố truy cập trang auth
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.next();
    }

    // Nếu chưa đăng nhập và cố truy cập routes được bảo vệ
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token không hợp lệ
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/orders/:path*',
    '/wishlist/:path*',
    '/cart/:path*',
    '/auth',
    '/admin/:path*'
  ],
}; 