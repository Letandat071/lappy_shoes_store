import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Kết nối database
    await connectDB();
    
    // Lấy id từ params
    const { id } = context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Tìm sản phẩm theo id
    const product = await Product.findById(id)
      .populate('category')
      .populate('features')
      .select('-__v');

    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin sản phẩm' },
      { status: 500 }
    );
  }
} 