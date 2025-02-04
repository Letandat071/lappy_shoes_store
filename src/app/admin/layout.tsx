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
  return <div className="relative z-0">{children}</div>;
}
