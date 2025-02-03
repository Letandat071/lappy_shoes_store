// src/app/api/addresses/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Định nghĩa kiểu cho params, cho phép id là string hoặc string[] để tương thích với Next.js
type Params = {
  id: string | string[];
};

/**
 * Handler PUT: Cập nhật địa chỉ
 * @param request - Đối tượng NextRequest chứa thông tin request
 * @param context - Chứa params lấy từ URL, trong đó id có thể là string hoặc string[]
 */
export async function PUT(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    // Kết nối tới database
    await connectDB();

    // Xác thực user bằng token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse JSON body
    const data = await request.json();
    const { fullName, phone, province, district, ward, address, isDefault } = data;

    // Kiểm tra dữ liệu bắt buộc
    if (!fullName || !phone || !province || !district || !ward || !address) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Vì params.id có thể là string hoặc string[], chuyển về string nếu cần
    const addressId = Array.isArray(context.params.id)
      ? context.params.id[0]
      : context.params.id;

    // Tìm địa chỉ cần cập nhật và đảm bảo nó thuộc về user đang đăng nhập
    const existingAddress = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Cập nhật thông tin
    existingAddress.fullName = fullName;
    existingAddress.phone = phone;
    existingAddress.province = province;
    existingAddress.district = district;
    existingAddress.ward = ward;
    existingAddress.address = address;
    existingAddress.isDefault = isDefault;

    // Lưu thay đổi vào database
    await existingAddress.save();

    return NextResponse.json({
      message: "Cập nhật địa chỉ thành công",
      address: existingAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handler DELETE: Xóa địa chỉ
 * @param request - Đối tượng NextRequest chứa thông tin request
 * @param context - Chứa params lấy từ URL, trong đó id có thể là string hoặc string[]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    // Kết nối tới database
    await connectDB();

    // Xác thực user bằng token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Chuyển đổi params.id về string nếu cần
    const addressId = Array.isArray(context.params.id)
      ? context.params.id[0]
      : context.params.id;

    // Tìm địa chỉ cần xóa và đảm bảo nó thuộc về user đang đăng nhập
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Nếu xóa địa chỉ mặc định, cập nhật địa chỉ khác làm mặc định nếu có
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({
        user: userId,
        _id: { $ne: addressId },
      });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    // Xóa địa chỉ khỏi database
    await address.deleteOne();

    return NextResponse.json({
      message: "Xóa địa chỉ thành công",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
