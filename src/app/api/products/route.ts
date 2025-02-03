import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product, { PRODUCT_STATUS } from "@/models/Product";
import Category from "@/models/Category";
import Feature from "@/models/Feature";
import mongoose from "mongoose";

// Đảm bảo các model được import
const models = { Product, Category, Feature };

interface ProductDocument {
  _id: any;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: Array<{
    url: string;
    color?: string;
    version?: string;
  }>;
  category: {
    _id: any;
    name: string;
  };
  features: Array<{
    _id: any;
    name: string;
    icon: string;
  }>;
  status: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: {
    _id: mongoose.Types.ObjectId;
    name: string;
  } | null;
  features: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    icon: string;
  }>;
  // ... thêm các trường khác
}

// Get all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Nếu có categoryId, lấy sản phẩm mới nhất của category đó
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      const latestProduct = await Product.findOne({ category: categoryId })
        .sort({ createdAt: -1 })
        .select('images')
        .lean();
      
      return NextResponse.json({ product: latestProduct });
    }

    // Pagination
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    
    // Nếu không có page và limit, trả về tất cả sản phẩm
    if (!page && !limit) {
      const products = await Product.find()
        .populate("category", "name")
        .populate("features", "name icon")
        .lean();

      const formattedProducts = products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        category: product.category ? {
          _id: product.category._id.toString(),
          name: product.category.name
        } : null,
        features: Array.isArray(product.features) ? product.features.map((feature: any) => ({
          _id: feature._id.toString(),
          name: feature.name,
          icon: feature.icon
        })) : []
      }));

      return NextResponse.json({ products: formattedProducts });
    }

    // Pagination
    const skip = (parseInt(page ?? "1") - 1) * parseInt(limit ?? "10");

    // Filters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const feature = searchParams.get("feature");
    const brand = searchParams.get("brand");
    const brands = searchParams.get("brands")?.split(",");
    const sizes = searchParams.get("sizes")?.split(",");
    const colors = searchParams.get("colors")?.split(",");
    const sort = searchParams.get("sort") || "-createdAt";
    const audience = searchParams.get("audience");

    // Build query
    let query: any = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Xử lý filter theo brands
    if (brands?.length) {
      query.brand = { $in: brands.map(b => new RegExp(b, 'i')) };
    } else if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    // Xử lý filter theo targetAudience
    if (audience) {
      query.targetAudience = audience;
    }

    if (sizes?.length) {
      query["sizes.size"] = { $in: sizes };
    }
    if (colors?.length) {
      query.colors = { $in: colors };
    }

    // Xử lý filter theo feature name
    if (feature) {
      // Tìm feature theo tên chính xác
      const featureDoc = await Feature.findOne({ 
        name: { $regex: `^${feature}$`, $options: "i" }
      });
      if (featureDoc) {
        query.features = featureDoc._id;
      } else {
        // Nếu không tìm thấy feature, trả về mảng rỗng
        return NextResponse.json({
          products: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        });
      }
    }

    console.log("Client Query:", JSON.stringify(query, null, 2));

    // Execute query with pagination
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("features", "name icon")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit ?? "10"))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Format response
    const formattedProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      category: product.category ? {
        _id: product.category._id.toString(),
        name: product.category.name
      } : null,
      features: Array.isArray(product.features) ? product.features.map((feature: any) => ({
        _id: feature._id.toString(),
        name: feature.name,
        icon: feature.icon
      })) : []
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / parseInt(limit ?? "10")),
      },
    });
  } catch (error: any) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
} 