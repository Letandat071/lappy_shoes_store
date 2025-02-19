import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import User from '@/models/User';

interface ProductParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: ProductParams) {
  try {
    await connectDB();

    const { id } = context.params;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Product ID is required" }), 
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
      .populate("category")
      .populate("features")
      .lean();

    if (!product) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ product }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// PUT: Cập nhật sản phẩm (chỉ admin)
export async function PUT(request: NextRequest, context: ProductParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden" }), 
        { status: 403 }
      );
    }

    const { id } = context.params;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Product ID is required" }), 
        { status: 400 }
      );
    }

    const body = await request.json();

    await connectDB();

    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!product) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ product }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// DELETE: Xóa sản phẩm (chỉ admin)
export async function DELETE(request: NextRequest, context: ProductParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden" }), 
        { status: 403 }
      );
    }

    const { id } = context.params;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Product ID is required" }), 
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
} 