import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Announcement from "@/models/Announcement";
import { shouldCache, cacheResponse } from "@/middleware/cache";

// GET: Lấy danh sách thông báo công khai (không cần xác thực)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status") || "active";

    const query: any = { status };
    if (type) query.type = type;

    const announcements = await Announcement.find(query)
      .sort("-priority createdAt")
      .lean();

    const response = NextResponse.json({ announcements });

    // Apply caching if applicable
    if (shouldCache(request)) {
      return await cacheResponse(request, response);
    }

    return response;

  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 