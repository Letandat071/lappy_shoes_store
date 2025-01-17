import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PUT(request: NextRequest) {
  try {
    console.log("1. API Update được gọi");
    await connectDB();
    console.log("2. Kết nối DB thành công");
    
    // Lấy user ID từ token
    console.log("3. Cookie từ request:", request.cookies.get("token"));
    const userId = await getDataFromToken(request);
    console.log("4. UserId từ token:", userId);

    if (!userId) {
      console.log("5. Không tìm thấy userId, trả về lỗi Unauthorized");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("6. Body từ request:", body);

    // Nếu có avatar, chỉ update avatar
    if (body.avatar) {
      console.log("7. Updating avatar:", body.avatar);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: body.avatar } },
        { new: true }
      ).select("-password");

      console.log("8. User sau khi update avatar:", updatedUser);
      return NextResponse.json({
        message: "Cập nhật avatar thành công",
        user: updatedUser
      });
    }

    // Nếu không có avatar, update thông tin khác
    const { name, email, phone, address } = body;

    // Kiểm tra email đã tồn tại chưa (nếu email thay đổi)
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    console.log("9. Kiểm tra email trùng:", existingUser);
    
    if (existingUser) {
      console.log("10. Email đã tồn tại, trả về lỗi");
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Cập nhật thông tin user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        address
      },
      { new: true, runValidators: true }
    ).select("-password");
    console.log("11. User sau khi update:", updatedUser);

    if (!updatedUser) {
      console.log("12. Không tìm thấy user để update");
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    console.log("13. Update thành công, trả về response");
    return NextResponse.json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser
    });

  } catch (error: any) {
    console.error("14. Lỗi trong quá trình xử lý:", error);
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra khi cập nhật thông tin" },
      { status: 500 }
    );
  }
} 