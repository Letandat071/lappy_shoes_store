"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/Dashboard";

export default function AdminPage() {
  const router = useRouter();

  return <AdminDashboard />;
}
