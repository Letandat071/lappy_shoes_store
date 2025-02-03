import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { FilterQuery } from "mongoose";
import mongoose from "mongoose";
import Product from "@/models/Product";

interface OrderDocument {
  status?: string;
  paymentStatus?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
  };
}

// Lấy danh sách đơn hàng (Admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin qua token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Lấy query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    // Tạo query
    const query: FilterQuery<OrderDocument> = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Tính toán phân trang
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);

    // Lấy danh sách đơn hàng
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .lean();

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// Cập nhật trạng thái đơn hàng (Admin)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin qua token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { orderId, status, paymentStatus, type } = data;

    if (!orderId || (!status && !paymentStatus)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Tìm đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Cập nhật trạng thái
    if (type === 'payment') {
      order.paymentStatus = status;
    } else {
      order.status = status;
    }

    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json({
      message: "Order updated successfully",
      order
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let session;
  try {
    await connectDB();
    const orderData = await request.json();

    console.log('Starting order process with data:', {
      items: orderData.items
    });

    session = await mongoose.startSession();
    session.startTransaction();

    // Cập nhật số lượng sản phẩm với session
    for (const item of orderData.items) {
      // console.log('Processing item:', item);

      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      console.log('Found product:', {
        id: product._id,
        currentSizes: product.sizes,
        currentTotal: product.totalQuantity
      });

      const sizeIndex = product.sizes.findIndex((s: { size: string }) => s.size === item.size);
      if (sizeIndex === -1) {
        throw new Error(`Size ${item.size} not found for product ${product.name}`);
      }

      const currentQuantity = product.sizes[sizeIndex].quantity;
      if (currentQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${currentQuantity}, Requested: ${item.quantity}`);
      }

      // Cập nhật số lượng
      product.sizes[sizeIndex].quantity = currentQuantity - item.quantity;
      product.markModified('sizes'); // Đảm bảo Mongoose nhận biết sự thay đổi

      // Tính lại tổng số lượng
      product.totalQuantity = product.sizes.reduce((sum: number, size: { quantity: number }) => sum + size.quantity, 0);
      
      console.log('After update:', {
        id: product._id,
        size: item.size,
        oldQuantity: currentQuantity,
        newQuantity: product.sizes[sizeIndex].quantity,
        newTotal: product.totalQuantity
      });

      // Cập nhật trạng thái
      if (product.totalQuantity === 0) {
        product.status = 'out-of-stock';
      }

      await product.save({ session });

      // Verify the save
      const verifyProduct = await Product.findById(product._id).session(session);
      console.log('Verify after save:', {
        id: verifyProduct._id,
        sizes: verifyProduct.sizes,
        totalQuantity: verifyProduct.totalQuantity
      });
    }

    // Tạo đơn hàng
    const order = await Order.create([orderData], { session });

    console.log('Before commit - Order created:', order[0]._id);

    // Commit transaction
    await session.commitTransaction();
    console.log('Transaction committed successfully');

    // Verify final state
    for (const item of orderData.items) {
      const finalProduct = await Product.findById(item.product);
      console.log('Final product state:', {
        id: finalProduct._id,
        sizes: finalProduct.sizes,
        totalQuantity: finalProduct.totalQuantity
      });
    }

    return NextResponse.json(order[0], { status: 201 });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    if (session) {
      console.log('Rolling back transaction');
      await session.abortTransaction();
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (session) {
      await session.endSession();
      console.log('Session ended');
    }
  }
} 