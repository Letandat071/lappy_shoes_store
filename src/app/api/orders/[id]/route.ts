import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Lấy chi tiết đơn hàng
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const order = await Order.findOne({
      _id: params.id,
      user: userId
    }).populate('items.product', 'name image price');

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });

  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Cập nhật đơn hàng
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const allowedUpdates = ['status', 'paymentStatus'];
    const updates = Object.keys(data);

    // Kiểm tra các trường được phép cập nhật
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return NextResponse.json(
        { error: "Invalid updates" },
        { status: 400 }
      );
    }

    // Tìm và cập nhật đơn hàng
    const order = await Order.findOne({
      _id: params.id,
      user: userId
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Kiểm tra trạng thái hợp lệ
    if (data.status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }

      // Không cho phép cập nhật trạng thái đã hoàn thành hoặc đã hủy
      if (
        (order.status === 'delivered' || order.status === 'cancelled') &&
        order.status !== data.status
      ) {
        return NextResponse.json(
          { error: "Cannot update completed or cancelled order" },
          { status: 400 }
        );
      }
    }

    // Cập nhật đơn hàng
    updates.forEach(update => {
      order[update] = data[update];
    });
    order.updatedAt = new Date();
    
    await order.save();

    return NextResponse.json({ 
      message: "Order updated successfully",
      order 
    });

  } catch (error: unknown) {
    console.error('Error updating order:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Hủy đơn hàng
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const order = await Order.findOne({
      _id: params.id,
      user: userId
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    // Chỉ cho phép hủy đơn hàng ở trạng thái chờ xử lý hoặc đang xử lý
    if (!['pending', 'processing'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Không thể hủy đơn hàng ở trạng thái này' },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đơn hàng thành đã hủy
    order.status = 'cancelled';
    await order.save();

    return NextResponse.json({ message: 'Hủy đơn hàng thành công' });
  } catch (error: unknown) {
    console.error('Error cancelling order:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 