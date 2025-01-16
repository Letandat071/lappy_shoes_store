import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Đăng xuất thành công" },
    { status: 200 }
  );

  // Xóa cookie
  response.cookies.delete("admin_token");

  return response;
} 