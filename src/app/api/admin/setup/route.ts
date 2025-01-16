import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    return NextResponse.json(
      { 
        message: "Tạo tài khoản admin thành công",
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tạo tài khoản" },
      { status: 500 }
    );
  }
} 