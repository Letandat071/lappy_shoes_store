import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Banner from "@/models/Banner";
import { shouldCache, cacheResponse } from "@/middleware/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const status = searchParams.get("status") || "active";

    const query: any = { status };
    if (position) query.position = position;

    const banners = await Banner.find(query)
      .sort("-priority createdAt")
      .lean();

    const response = NextResponse.json({ banners });

    // Apply caching if applicable
    if (shouldCache(request)) {
      return await cacheResponse(request, response);
    }

    return response;

  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 