import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import mongoose, { FilterQuery } from "mongoose";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Import models sau khi đã connect mongoose
import "@/models/Category";
import "@/models/Feature";
import Product from "@/models/Product";

interface ProductImage {
  url: string;
  color?: string;
  version?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

interface ProductSize {
  size: string;
  quantity: number;
  _id?: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  images?: ProductImage[];
  category?: string;
  features?: string[];
  sizes?: ProductSize[];
  colors?: string[];
  status?: string;
  brand?: string;
  targetAudience?: string[];
  totalQuantity?: number;
  [key: string]: unknown;
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

// Get all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category");
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const feature = searchParams.get("feature");

    // Build query với kiểu FilterQuery<ProductDocument>
    const query: FilterQuery<ProductDocument> = {};
    if (category) query.category = category;
    if (statusFilter) query.status = statusFilter;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      query.price = priceFilter;
    }
    if (feature) {
      const featureDoc = await mongoose.models.Feature.findOne({ name: feature });
      if (featureDoc) {
        query.features = featureDoc._id;
      }
    }

    // Sử dụng generic cho lean() để kết quả có kiểu chính xác
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("features", "name icon")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ProductDocument[]>();

    // Format lại dữ liệu trả về nếu cần thiết (ép kiểu cho category và features)
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      category:
        typeof product.category === "object" && product.category !== null
          ? {
              _id: (product.category as CategoryDoc)._id.toString(),
              name: (product.category as CategoryDoc).name,
            }
          : null,
      features: Array.isArray(product.features)
        ? (product.features as Array<{ _id: mongoose.Types.ObjectId; name: string; icon: string }>).map((featureItem) => ({
            _id: featureItem._id.toString(),
            name: featureItem.name,
            icon: featureItem.icon,
          }))
        : [],
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error: unknown) {
    console.error("GET Products Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 