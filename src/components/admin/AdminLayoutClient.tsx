"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/check');
        const data = await res.json();
        
        if (!isSubscribed) return;

        if (!data.authenticated) {
          router.replace('/admin/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isSubscribed) {
          router.replace('/admin/login');
        }
      }
    };

    checkAuth();

    return () => {
      isSubscribed = false;
    };
  }, [router]);

  // Tránh hydration mismatch
  if (!mounted) return null;

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 