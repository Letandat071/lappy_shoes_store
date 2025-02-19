import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import User from "@/models/User";

// Đảm bảo model Address có đủ các trường
interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;  // Thêm các trường này
  district: string;
  ward: string;
}

// GET: Lấy danh sách địa chỉ của người dùng
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const addresses = await Address.find({ user: user._id })
      .sort({ isDefault: -1, createdAt: -1 });

    return new NextResponse(
      JSON.stringify({ addresses }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/addresses:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// POST: Thêm địa chỉ mới
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const body = await request.json();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    // Kiểm tra xem có phải địa chỉ đầu tiên không
    const addressCount = await Address.countDocuments({ user: user._id });
    const isDefault = body.isDefault || addressCount === 0;

    const newAddress = await Address.create({
      ...body,
      user: user._id,
      isDefault
    });

    return new NextResponse(
      JSON.stringify({ address: newAddress }), 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/addresses:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { status: 500 }
    );
  }
}

// PUT: Cập nhật địa chỉ
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, user: user._id },
      updateData,
      { new: true }
    );

    if (!address) {
      return new NextResponse(
        JSON.stringify({ error: "Address not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ address }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/addresses:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// DELETE: Xóa địa chỉ
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Address ID is required" }), 
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const address = await Address.findOneAndDelete({ _id: id, user: user._id });

    if (!address) {
      return new NextResponse(
        JSON.stringify({ error: "Address not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/addresses:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
} 