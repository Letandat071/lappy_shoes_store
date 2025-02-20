import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

// Hàm kiểm tra admin token
async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value || "";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jose.jwtVerify(token, secret);
    return payload.adminId;
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return null;
  }
}

// GET: Lấy danh sách người dùng với phân trang và tìm kiếm
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || "1");
    const limit = parseInt(searchParams.get('limit') || "10");
    const search = searchParams.get("search");

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]
      };
    }
    
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password') // Loại bỏ trường password
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
} 