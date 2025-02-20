import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import connectDB from "@/lib/mongoose";
import Notification from "@/models/Notification";

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

// GET: Lấy danh sách thông báo chưa đọc
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Lấy thông báo chưa đọc, sắp xếp theo thời gian mới nhất
    const notifications = await Notification.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Đếm tổng số thông báo chưa đọc
    const unreadCount = await Notification.countDocuments({ isRead: false });

    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH: Đánh dấu thông báo đã đọc
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đã đọc
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true
    });

    return NextResponse.json({
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Tạo thông báo mới (có thể dùng khi có sự kiện mới như đơn hàng mới)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, message, type, link } = data;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    // Tạo thông báo mới
    const notification = await Notification.create({
      title,
      message,
      type,
      link
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 