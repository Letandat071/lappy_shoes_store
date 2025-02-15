import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import mongoose, { FilterQuery } from "mongoose";

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

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filters
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const feature = searchParams.get("feature");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query với kiểu FilterQuery<ProductDocument>
    const query: FilterQuery<ProductDocument> = {};

    // Xử lý filter theo categories
    const categories = searchParams.getAll("categories[]");
    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    // Xử lý filter theo audience
    const audience = searchParams.get("audience");
    if (audience) {
      query.targetAudience = {
        $in: [audience.toLowerCase()]
      };
    }

    // Xử lý filter theo feature
    if (feature) {
      try {
        // Thử parse feature như một ObjectId
        new mongoose.Types.ObjectId(feature);
        query.features = {
          $in: [new mongoose.Types.ObjectId(feature)]
        };
      } catch {
        // Nếu không phải ObjectId, tìm feature theo tên
        const featureDoc = await mongoose.model('Feature').findOne({ 
          name: { $regex: new RegExp(feature, 'i') }
        });
        if (featureDoc) {
          query.features = {
            $in: [featureDoc._id]
          };
        }
      }
    }

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

    // Xử lý sort
    let sortOption: any = { createdAt: -1 }; // Default sort
    if (sort) {
      if (sort === "price") {
        sortOption = { price: 1 };
      } else if (sort === "-price") {
        sortOption = { price: -1 };
      } else if (sort === "-rating") {
        sortOption = { rating: -1 };
      } else if (sort === "-createdAt") {
        sortOption = { createdAt: -1 };
      }
    }

    // Sử dụng generic cho lean() để kết quả có kiểu chính xác
    const products = await Product.find(query)
      .populate("category", "name")
      .populate({
        path: "features",
        select: "_id name description icon"
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean<ProductDocument[]>();

    // Đếm tổng số sản phẩm để phân trang
    const total = await Product.countDocuments(query);

    // Format lại dữ liệu trả về
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      slug: product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      category: typeof product.category === "object" && product.category !== null
        ? {
            _id: (product.category as CategoryDoc)._id.toString(),
            name: (product.category as CategoryDoc).name,
          }
        : null,
      features: Array.isArray(product.features)
        ? product.features.map((feature: any) => feature._id.toString())
        : []
    }));


    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: unknown) {
    console.error("GET Products Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 