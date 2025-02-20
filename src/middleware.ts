import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose';

// Các routes cần xác thực
const protectedRoutes = [
  '/profile',
  '/orders',
  '/wishlist',
  '/cart',
];

// Các routes chỉ cho phép truy cập khi chưa đăng nhập
const authRoutes = ['/auth'];

// Các routes admin chỉ cho phép truy cập khi chưa đăng nhập
const adminAuthRoutes = ['/admin/login'];

// Các routes admin cần xác thực
const protectedAdminRoutes = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/orders',
  '/admin/users',
  '/admin/categories',
  '/admin/features',
  '/admin/banner',
  '/admin/announcements'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Xử lý admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = req.cookies.get('admin_token')?.value;
    
    // Nếu đang truy cập trang login admin
    if (adminAuthRoutes.some(route => pathname.startsWith(route))) {
      // Nếu đã có token, redirect về dashboard
      if (adminToken) {
        try {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
          await jose.jwtVerify(adminToken, secret);
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        } catch (error) {
          // Token không hợp lệ, cho phép tiếp tục vào trang login
          const response = NextResponse.next();
          response.cookies.delete('admin_token');
          return response;
        }
      }
      return NextResponse.next();
    }

    // Kiểm tra token cho các routes được bảo vệ
    if (protectedAdminRoutes.some(route => pathname.startsWith(route))) {
      if (!adminToken) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }

      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
        await jose.jwtVerify(adminToken, secret);
        return NextResponse.next();
      } catch (error) {
        const response = NextResponse.redirect(new URL('/admin/login', req.url));
        response.cookies.delete('admin_token');
        return response;
      }
    }

    return NextResponse.next();
  }

  // Xử lý user routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = req.cookies.get('next-auth.session-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  // Nếu đã đăng nhập và cố truy cập trang auth
  if (authRoutes.includes(pathname)) {
    const token = req.cookies.get('next-auth.session-token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
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