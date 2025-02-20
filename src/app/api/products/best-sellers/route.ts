import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { shouldCache, cacheResponse } from "@/middleware/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Tính tổng số lượng đã bán của mỗi sản phẩm
    const soldProducts = await Order.aggregate([
      // Chỉ lấy đơn hàng đã giao thành công
      { $match: { status: "delivered" } },
      // Tách các items trong đơn hàng
      { $unwind: "$items" },
      // Group theo product ID và tính tổng số lượng
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      // Sắp xếp giảm dần theo số lượng bán
      { $sort: { totalSold: -1 } },
      // Giới hạn 8 sản phẩm
      { $limit: 8 }
    ]);

    // Lấy thông tin chi tiết của các sản phẩm
    const productIds = soldProducts.map(p => p._id);
    const products = await Product.find({
      _id: { $in: productIds },
      status: "in-stock" // Chỉ lấy sản phẩm còn hàng
    })
      .populate("category", "name")
      .lean();

    // Kết hợp thông tin số lượng đã bán vào sản phẩm
    const bestSellers = products.map(product => {
      const soldInfo = soldProducts.find(p => p._id.toString() === product._id.toString());
      return {
        ...product,
        totalSold: soldInfo?.totalSold || 0
      };
    });

    // Sắp xếp lại theo số lượng bán
    bestSellers.sort((a, b) => b.totalSold - a.totalSold);

    const response = NextResponse.json({ products: bestSellers });

    // Apply caching if applicable
    if (shouldCache(request)) {
      return await cacheResponse(request, response);
    }

    return response;

  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 