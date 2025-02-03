// src/app/api/addresses/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import { getDataFromToken } from "@/helpers/getDataFromToken";

/**
 * Handler PUT: Cập nhật địa chỉ
 * @param request - Đối tượng NextRequest chứa thông tin request
 * @param param1 - Destructure context lấy params chứa id của địa chỉ
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kết nối tới database
    await connectDB();

    // Lấy thông tin user từ token (Authentication)
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse dữ liệu JSON từ request body
    const data = await request.json();
    const { fullName, phone, province, district, ward, address, isDefault } = data;

    // Validate dữ liệu đầu vào
    if (!fullName || !phone || !province || !district || !ward || !address) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Tìm địa chỉ cần cập nhật, đảm bảo địa chỉ thuộc về user đang đăng nhập
    const existingAddress = await Address.findOne({
      _id: params.id,
      user: userId
    });
    if (!existingAddress) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Cập nhật các trường dữ liệu
    existingAddress.fullName = fullName;
    existingAddress.phone = phone;
    existingAddress.province = province;
    existingAddress.district = district;
    existingAddress.ward = ward;
    existingAddress.address = address;
    existingAddress.isDefault = isDefault;

    // Lưu lại thay đổi vào database
    await existingAddress.save();

    return NextResponse.json({
      message: "Cập nhật địa chỉ thành công",
      address: existingAddress
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
 * @param param1 - Destructure context lấy params chứa id của địa chỉ
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kết nối tới database
    await connectDB();

    // Lấy thông tin user từ token (Authentication)
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Tìm địa chỉ cần xóa, đảm bảo địa chỉ thuộc về user đang đăng nhập
    const addressId = params.id;
    const address = await Address.findOne({
      _id: addressId,
      user: userId
    });
    if (!address) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Nếu xóa địa chỉ mặc định, tìm địa chỉ khác để cập nhật làm mặc định
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({
        user: userId,
        _id: { $ne: addressId }
      });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    // Xóa địa chỉ khỏi database
    await address.deleteOne();

    return NextResponse.json({
      message: "Xóa địa chỉ thành công"
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
