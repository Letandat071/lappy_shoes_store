// src/app/api/addresses/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Address from "@/models/Address";
import { getDataFromToken } from "@/helpers/getDataFromToken";

/**
 * Handler PUT: Cập nhật địa chỉ
 * @param request - Đối tượng NextRequest chứa thông tin request
 * @param context - Chứa params lấy từ URL, ở đây id luôn là string
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }  // Chỉ định rõ id là string
) {
  try {
    // Kết nối tới database
    await connectDB();

    // Xác thực người dùng qua token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse dữ liệu JSON từ request body
    const data = await request.json();
    const { fullName, phone, province, district, ward, address, isDefault } = data;

    // Kiểm tra dữ liệu bắt buộc
    if (!fullName || !phone || !province || !district || !ward || !address) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Lấy id của địa chỉ từ params (đã được đảm bảo là string)
    const addressId = params.id;

    // Tìm địa chỉ cần cập nhật và kiểm tra quyền sở hữu
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

    // Cập nhật các trường thông tin
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
 * @param context - Chứa params lấy từ URL, ở đây id luôn là string
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // Chỉ định rõ id là string
) {
  try {
    // Kết nối tới database
    await connectDB();

    // Xác thực người dùng qua token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy id của địa chỉ từ params (đã được đảm bảo là string)
    const addressId = params.id;

    // Tìm địa chỉ cần xóa và kiểm tra quyền sở hữu
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
