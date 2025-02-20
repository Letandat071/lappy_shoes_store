import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
import { shouldCache, cacheResponse } from "@/middleware/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get("includeProducts") === "true";

    let query = Category.find().sort("order name");
    
    if (includeProducts) {
      query = query.populate({
        path: "products",
        match: { status: "in-stock" },
        select: "name images price status",
      });
    }

    const categories = await query.lean();

    const response = NextResponse.json({ categories });

    // Apply caching if applicable 
    if (shouldCache(request)) {
      return await cacheResponse(request, response);
    }

    return response;

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 