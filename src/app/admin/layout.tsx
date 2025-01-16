import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Lappy Shoes",
  description: "Quản lý cửa hàng Lappy Shoes",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 