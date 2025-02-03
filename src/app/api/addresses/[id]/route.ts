import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Cập nhật địa chỉ
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
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

    // Kiểm tra địa chỉ tồn tại và thuộc về user
    const existingAddress = await Address.findOne({
      _id: context.params.id,
      user: userId
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Không tìm thấy địa chỉ" },
        { status: 404 }
      );
    }

    // Cập nhật địa chỉ
    existingAddress.fullName = fullName;
    existingAddress.phone = phone;
    existingAddress.province = province;
    existingAddress.district = district;
    existingAddress.ward = ward;
    existingAddress.address = address;
    existingAddress.isDefault = isDefault;

    await existingAddress.save();

    return NextResponse.json({
      message: "Cập nhật địa chỉ thành công",
      address: existingAddress
    });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Xóa địa chỉ
export async function DELETE(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kiểm tra địa chỉ tồn tại và thuộc về user
    const addressId = context.params.id;
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

    // Nếu xóa địa chỉ mặc định, đặt địa chỉ khác làm mặc định
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

    await address.deleteOne();

    return NextResponse.json({
      message: "Xóa địa chỉ thành công"
    });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 