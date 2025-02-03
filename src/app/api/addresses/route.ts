import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import { getDataFromToken } from "@/helpers/getDataFromToken";

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
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Lấy userId từ token (đang đăng nhập)
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Truy vấn danh sách địa chỉ của user theo userId và sắp xếp ưu tiên địa chỉ mặc định
    const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Thêm địa chỉ mới (đã tích hợp cho admin hoặc người dùng)
// Nếu admin muốn thêm địa chỉ cho người dùng khác, có thể truyền userId trong body.
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Lấy userId từ token
    const tokenUserId = await getDataFromToken(request);
    if (!tokenUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    // Nếu body có userId thì dùng cho trường hợp admin thao tác, nếu không thì dùng tokenUserId
    const userId = data.userId ? data.userId : tokenUserId;
    const { fullName, phone, province, district, ward, address, isDefault } = data;

    // Validate dữ liệu
    if (!fullName || !phone || !province || !district || !ward || !address) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    // Nếu là địa chỉ đầu tiên hoặc đặt làm mặc định, thì bật isDefault
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

    return NextResponse.json({ message: "Thêm địa chỉ thành công", address: newAddress }, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 