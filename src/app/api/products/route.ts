import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import mongoose, { FilterQuery } from "mongoose";
import Product from "@/models/Product";
import { shouldCache, cacheResponse } from "@/middleware/cache";

// Import models sau khi đã connect mongoose
import "@/models/Category";
import "@/models/Feature";

interface ProductImage {
  url: string;
  color?: string;
  version?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

// Sử dụng interface này trong generic của hàm lean()
export interface ProductDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: ProductImage[];
  category: mongoose.Types.ObjectId | {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  features: mongoose.Types.ObjectId[] | Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    icon: string;
  }>;
  status: string;
  rating?: number;
  reviewCount?: number;
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
  totalQuantity: number;
}

// Interface định nghĩa kiểu của category sau khi populate
interface CategoryDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  images?: ProductImage[];
  category?: mongoose.Types.ObjectId;
  features?: mongoose.Types.ObjectId[];
  status?: string;
  brand?: string;
  colors?: string[];
  sizes?: Array<{
    size: string;
    quantity: number;
  }>;
  totalQuantity?: number;
  isActive?: boolean;
}

// Get all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const feature = searchParams.get("feature");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query
    const query: FilterQuery<ProductDocument> = { status: "in-stock" };

    // Xử lý category
    if (category) {
      try {
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = new mongoose.Types.ObjectId(category);
        } else {
          // Nếu category không phải ObjectId, có thể là slug hoặc name
          const Category = mongoose.model('Category');
          const categoryDoc = await Category.findOne({ 
            $or: [
              { slug: category },
              { name: { $regex: category, $options: 'i' } }
            ]
          });
          if (categoryDoc) {
            query.category = categoryDoc._id;
          }
        }
      } catch (error) {
        console.error("Error processing category:", error);
      }
    }

    // Xử lý feature
    if (feature) {
      try {
        if (mongoose.Types.ObjectId.isValid(feature)) {
          query.features = new mongoose.Types.ObjectId(feature);
        } else {
          // Nếu feature không phải ObjectId, tìm theo name
          const Feature = mongoose.model('Feature');
          const featureDoc = await Feature.findOne({ 
            name: { $regex: feature, $options: 'i' }
          });
          if (featureDoc) {
            query.features = featureDoc._id;
          }
        }
      } catch (error) {
        console.error("Error processing feature:", error);
      }
    }

    // Xử lý search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Xử lý price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);

    // Get products
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("features", "name icon")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const response = NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

    // Apply caching if applicable
    if (shouldCache(request)) {
      return await cacheResponse(request, response);
    }

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 