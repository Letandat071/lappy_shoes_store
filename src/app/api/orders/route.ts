import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from 'mongoose';
import Product from '@/models/Product';

// Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  let session;
  try {
    await connectDB();
    const orderData = await request.json();

    // Lấy userId từ token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Thêm userId vào orderData
    const orderWithUser = {
      ...orderData,
      user: userId,
      status: 'processing',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'pending' : 'completed'
    };

    // console.log('=== START ORDER PROCESSING ===');
    // console.log('Order Data:', JSON.stringify(orderWithUser, null, 2));

    session = await mongoose.startSession();
    session.startTransaction();
    // console.log('Transaction started');

    // Xử lý từng item
    for (const item of orderData.items) {
      // console.log(`\nProcessing item: ${item.product}, size: ${item.size}, quantity: ${item.quantity}`);

      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      // console.log('Current product state:', {
      //   id: product._id.toString(),
      //   sizes: product.sizes,
      //   totalQuantity: product.totalQuantity
      // });

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

      // console.log('Quantity update:', {
      //   productId: product._id.toString(),
      //   size: item.size,
      //   oldQuantity: currentQuantity,
      //   newQuantity: product.sizes[sizeIndex].quantity,
      //   newTotal: product.totalQuantity
      // });

      await product.save({ session });
      console.log('Product saved successfully');
    }

    // Tạo đơn hàng với userId
    const order = await Order.create([orderWithUser], { session });
    console.log('Order created:', order[0]._id.toString());

    // Commit transaction
    await session.commitTransaction();
    // console.log('=== TRANSACTION COMMITTED SUCCESSFULLY ===');

    return NextResponse.json(order[0], { status: 201 });

  } catch (error: unknown) {
    console.error('=== ORDER PROCESSING ERROR ===');
    console.error(error);
    if (session) {
      await session.abortTransaction();
      console.log('Transaction rolled back');
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (session) {
      await session.endSession();
      console.log('=== SESSION ENDED ===');
    }
  }
}

// GET /api/orders - Lấy danh sách đơn hàng của user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Lấy thông tin user từ token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price');

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 