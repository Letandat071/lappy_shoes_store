import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Lấy danh sách địa chỉ của user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    return NextResponse.json({ addresses });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Thêm địa chỉ mới
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { fullName, phone, province, district, ward, address, isDefault } = data;

    // Validate dữ liệu
    if (!fullName || !phone || !province || !district || !ward || !address) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Nếu là địa chỉ đầu tiên, đặt làm mặc định
    const addressCount = await Address.countDocuments({ user: userId });
    const shouldBeDefault = isDefault || addressCount === 0;

    const newAddress = await Address.create({
      user: userId,
      fullName,
      phone,
      province,
      district,
      ward,
      address,
      isDefault: shouldBeDefault
    });

    return NextResponse.json(
      { message: "Thêm địa chỉ thành công", address: newAddress },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 