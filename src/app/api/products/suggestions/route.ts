import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import { getProductSuggestions } from "@/services/gemini";
import { Types } from "mongoose";

interface ProductDocument {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    color?: string;
  }>;
  category: {
    name: string;
  };
  status: string;
  rating?: number;
  reviewCount?: number;
}

interface Suggestion {
  type: 'viewed' | 'purchased' | 'category' | 'search';
  reason: string;
  keywords: string[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const behaviorStr = searchParams.get('behavior');

    if (!behaviorStr) {
      return NextResponse.json({ error: 'Missing behavior parameter' }, { status: 400 });
    }

    const behavior = JSON.parse(behaviorStr);
    const { suggestions } = await getProductSuggestions(behavior);

    await connectDB();

    const suggestedProductIds = new Set<string>();
    const suggestedProducts = [];

    // Xử lý từng suggestion
    for (const suggestion of suggestions) {
      const { keywords } = suggestion;
      if (!keywords?.length) continue;

      // Tìm sản phẩm dựa trên keywords
      const products = await Product.find({
        status: "in-stock",
        _id: { $nin: Array.from(suggestedProductIds) },
        $or: [
          { name: { $regex: new RegExp(keywords.join('|'), 'i') } },
          { description: { $regex: new RegExp(keywords.join('|'), 'i') } },
          { 'category.name': { $in: keywords } }
        ]
      })
      .populate('category', 'name')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5)
      .lean();

      // Thêm vào danh sách gợi ý nếu chưa có
      for (const product of products) {
        if (!suggestedProductIds.has(product._id.toString())) {
          suggestedProductIds.add(product._id.toString());
          suggestedProducts.push({
            ...product,
            suggestionType: suggestion.type,
            suggestionReason: suggestion.reason
          });
        }
      }
    }

    // Nếu không đủ 5 sản phẩm, thêm các sản phẩm được đánh giá cao
    if (suggestedProducts.length < 5) {
      const topProducts = await Product.find({
        status: "in-stock",
        _id: { $nin: Array.from(suggestedProductIds) }
      })
      .populate('category', 'name')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5 - suggestedProducts.length)
      .lean();

      suggestedProducts.push(...topProducts.map(product => ({
        ...product,
        suggestionType: 'category' as const,
        suggestionReason: 'Sản phẩm được đánh giá cao'
      })));
    }

    // Giới hạn tối đa 10 sản phẩm
    return NextResponse.json({ 
      products: suggestedProducts.slice(0, 10)
    });

  } catch (error) {
    console.error('Error in suggestions route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 