import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

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

    // Lấy thời điểm đầu tháng và cuối tháng hiện tại
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Lấy thời điểm đầu tháng và cuối tháng trước
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Tính doanh thu tháng này
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $nin: ['cancelled'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Tính doanh thu tháng trước
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $nin: ['cancelled'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Đếm số đơn hàng mới trong tháng
    const newOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Đếm số đơn hàng tháng trước
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Đếm số khách hàng mới trong tháng
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Đếm số khách hàng tháng trước
    const lastMonthCustomers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Tính tổng số sản phẩm đã bán trong tháng
    const soldProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $nin: ['cancelled'] }
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$items.quantity" }
        }
      }
    ]);

    // Tính tổng số sản phẩm đã bán tháng trước
    const lastMonthSoldProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $nin: ['cancelled'] }
        }
      },
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$items.quantity" }
        }
      }
    ]);

    // Tính phần trăm thay đổi
    const currentMonthRevenue = monthlyRevenue[0]?.total || 0;
    const previousMonthRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueChange = previousMonthRevenue === 0 ? 100 :
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

    const ordersChange = lastMonthOrders === 0 ? 100 :
      ((newOrders - lastMonthOrders) / lastMonthOrders) * 100;

    const customersChange = lastMonthCustomers === 0 ? 100 :
      ((newCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;

    const currentSoldProducts = soldProducts[0]?.total || 0;
    const previousSoldProducts = lastMonthSoldProducts[0]?.total || 0;
    const productsChange = previousSoldProducts === 0 ? 100 :
      ((currentSoldProducts - previousSoldProducts) / previousSoldProducts) * 100;

    return NextResponse.json({
      stats: {
        monthlyRevenue: currentMonthRevenue,
        newOrders,
        newCustomers,
        soldProducts: currentSoldProducts,
        revenueChange: Number(revenueChange.toFixed(1)),
        ordersChange: Number(ordersChange.toFixed(1)),
        customersChange: Number(customersChange.toFixed(1)),
        productsChange: Number(productsChange.toFixed(1))
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 