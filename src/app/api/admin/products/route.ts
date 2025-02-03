import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import mongoose, { FilterQuery } from "mongoose";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Import models after mongoose
import "@/models/Category";
import "@/models/Feature";
import Product, { PRODUCT_STATUS } from "@/models/Product";

// Xóa biến Category vì không được sử dụng
const Feature = mongoose.models.Feature;

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
  [key: string]: string | number | boolean | ProductImage[] | ProductSize[] | string[] | undefined;
}

interface ProductDocument extends mongoose.Document {
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

// Get all products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const feature = searchParams.get("feature");

    // Build query
    const query: FilterQuery<ProductDocument> = {};
    
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

    // Xử lý filter theo feature name
    if (feature) {
      // Tìm feature theo tên
      const featureDoc = await Feature.findOne({ name: feature });
      if (featureDoc) {
        query.features = featureDoc._id;
      }
    }

    console.log("Admin Query:", JSON.stringify(query, null, 2));

    // Execute query with pagination
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("features", "name icon")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ProductDocument[]>();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Format response
    const formattedProducts = products.map((product: ProductDocument) => ({
      ...product,
      _id: product._id.toString(),
      images: Array.isArray(product.images)
        ? product.images
            .map((img: ProductImage) => ({
              url: img.url || '',
              color: img.color || '',
              version: img.version || ''
            }))
            .filter((img: ProductImage) => img.url)
        : [],
      category: product.category && typeof product.category === 'object' ? {
          _id: (product.category as { _id: mongoose.Types.ObjectId })._id.toString(),
          name: (product.category as { name: string }).name
        } : null,
      features: Array.isArray(product.features)
        ? (product.features as Array<{ _id: mongoose.Types.ObjectId; name: string; icon: string }>).map(
            (feature) => ({
              _id: feature._id.toString(),
              name: feature.name,
              icon: feature.icon,
            })
          )
        : []
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const productData = await request.json();
    
    // Extract image URLs from ProductImage objects if they exist
    const images: ProductImage[] = productData.images?.map((img: ProductImage) => ({
      url: img.url,
      color: img.color || '',
      version: img.version || ''
    })) || [];
    
    // Calculate total quantity from sizes
    const totalQuantity: number = productData.sizes?.reduce(
      (acc: number, size: ProductSize) => acc + size.quantity,
      0
    ) || 0;

    // Set status based on totalQuantity
    const productStatus = totalQuantity === 0 ? 
      PRODUCT_STATUS.OUT_OF_STOCK : 
      productData.status || PRODUCT_STATUS.IN_STOCK;

    // Create product with processed data
    const product = await Product.create({
      ...productData,
      images,
      totalQuantity,
      status: productStatus
    });

    // Populate references for response
    const populatedProduct = await product.populate([
      { path: "category", select: "name" },
      { path: "features", select: "name icon" },
    ]);

    return NextResponse.json({ product: populatedProduct }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id, ...updateData } = await request.json() as { id: string } & UpdateProductData;

    console.log("Update Data:", JSON.stringify(updateData, null, 2));
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Clean up images data
    const images = updateData.images?.map((img: ProductImage) => ({
      url: img.url,
      color: img.color || '',
      version: img.version || ''
    }));

    // Clean up sizes data
    const sizes = updateData.sizes?.map(({ size, quantity }: ProductSize) => ({
      size,
      quantity
    }));
    
    // Calculate total quantity
    const totalQuantity = sizes?.reduce(
      (acc, size) => acc + size.quantity,
      0
    ) || 0;

    // Set status based on totalQuantity unless explicitly set
    const productStatus = totalQuantity === 0 ? 
      PRODUCT_STATUS.OUT_OF_STOCK : 
      updateData.status || PRODUCT_STATUS.IN_STOCK;

    // Prepare update data
    const updateFields: UpdateProductData = {
      ...updateData,
      images,
      sizes,
      totalQuantity,
      status: productStatus
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => 
      updateFields[key] === undefined && delete updateFields[key]
    );

    console.log("Final Update Fields:", JSON.stringify(updateFields, null, 2));

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { 
        new: true,
        runValidators: true
      }
    ).populate([
      { path: "category", select: "name" },
      { path: "features", select: "name icon" },
    ]);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: unknown) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal Server Error",
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
} 