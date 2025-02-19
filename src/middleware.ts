import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Xử lý admin routes
    if (pathname.startsWith('/admin')) {
      const isAdmin = token?.role === 'admin';
      
      if (isAdmin) {
        // Nếu đã đăng nhập và cố truy cập trang login admin
        if (adminAuthRoutes.some(route => pathname.startsWith(route))) {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
        return NextResponse.next();
      }

      // Nếu không phải admin hoặc chưa đăng nhập
      if (!adminAuthRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return NextResponse.next();
    }

    // Xử lý user routes
    if (token) {
      // Nếu đã đăng nhập và cố truy cập trang auth
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    // Nếu chưa đăng nhập và cố truy cập routes được bảo vệ
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Cho phép truy cập vào trang login khi chưa đăng nhập
        if (authRoutes.includes(req.nextUrl.pathname) || 
            adminAuthRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return true;
        }
        // Yêu cầu token cho các routes được bảo vệ
        return !!token;
      },
    },
  }
);

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