import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import AnnouncementBar from "@/models/AnnouncementBar";

// GET: Lấy danh sách thông báo công khai (không cần xác thực)
export async function GET() {
  try {
    await connectDB();
    // Lấy tất cả thông báo, sắp xếp giảm dần theo thời gian cập nhật
    const announcements = await AnnouncementBar.find().sort({ updatedAt: -1 });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching public announcements:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
} 