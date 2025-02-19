import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import mongoose from 'mongoose';
import Product from '@/models/Product';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface OrderDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  paymentStatus: string;
}

// Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  let session;
  let mongoSession;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    await connectDB();
    const orderData = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    // Thêm userId vào orderData
    const orderWithUser = {
      ...orderData,
      user: user._id,
      status: 'processing',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'pending' : 'completed'
    };

    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    // Xử lý từng item
    for (const item of orderData.items) {
      const product = await Product.findById(item.product).session(mongoSession);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      const sizeIndex = product.sizes.findIndex((s: { size: string }) => s.size === item.size);
      if (sizeIndex === -1) {
        throw new Error(`Size ${item.size} not found for product ${product.name}`);
      }

      const currentQuantity = product.sizes[sizeIndex].quantity;
      if (currentQuantity < item.quantity) {
        throw new Error(`Insufficient stock. Available: ${currentQuantity}, Requested: ${item.quantity}`);
      }

      // Cập nhật số lượng
      product.sizes[sizeIndex].quantity = currentQuantity - item.quantity;
      product.markModified('sizes');

      // Tính lại tổng số lượng
      product.totalQuantity = product.sizes.reduce((sum: number, size: { quantity: number }) => sum + size.quantity, 0);

      await product.save({ session: mongoSession });
    }

    // Tạo đơn hàng với userId
    const order = await Order.create([orderWithUser], { session: mongoSession });

    // Commit transaction
    await mongoSession.commitTransaction();

    return new NextResponse(
      JSON.stringify({ order: order[0] }), 
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('=== ORDER PROCESSING ERROR ===');
    console.error(error);
    if (mongoSession) {
      await mongoSession.abortTransaction();
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(
      JSON.stringify({ error: message }), 
      { status: 500 }
    );
  } finally {
    if (mongoSession) {
      await mongoSession.endSession();
    }
  }
}

// GET: Lấy danh sách đơn hàng của người dùng
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price');

    // Format lại dữ liệu trước khi trả về
    const formattedOrders = orders.map((order: any) => ({
      _id: order._id.toString(),
      createdAt: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.items.map((item: any) => ({
        product: {
          _id: item.product._id.toString(),
          name: item.product.name,
          image: item.product.images?.[0]?.url || null,
          price: item.product.price
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus
    }));

    return new NextResponse(
      JSON.stringify({ orders: formattedOrders }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/orders:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

// DELETE: Hủy đơn hàng
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get("id");

    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ error: "Order ID is required" }), 
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const order = await Order.findOne({ _id: orderId, user: user._id });
    
    if (!order) {
      return new NextResponse(
        JSON.stringify({ error: "Order not found" }), 
        { status: 404 }
      );
    }

    // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc processing
    if (!['pending', 'processing'].includes(order.status)) {
      return new NextResponse(
        JSON.stringify({ error: "Cannot cancel this order" }), 
        { status: 400 }
      );
    }

    order.status = 'cancelled';
    await order.save();

    return new NextResponse(
      JSON.stringify({ message: "Order cancelled successfully" }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/orders:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
} 