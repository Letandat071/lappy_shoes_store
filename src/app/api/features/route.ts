import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Feature from "@/models/Feature";
import { shouldCache, cacheResponse } from "@/middleware/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get("includeProducts") === "true";

    let query = Feature.find().sort("order name");
    
    if (includeProducts) {
      query = query.populate({
        path: "products",
        match: { status: "in-stock" },
        select: "name images price status",
      });
    }

    const features = await query.lean();

    const response = NextResponse.json({ features });

    // Apply caching if applicable
    if (shouldCache(request)) {
      return await cacheResponse(request, response);
    }

    return response;

  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 