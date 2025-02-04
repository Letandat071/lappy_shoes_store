import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: unknown
) {
  const { params } = context as { params: { id: string } };
  
  try {
    // Kết nối database
    await connectDB();

    const id = params.id;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
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
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // console.log('Product details:', {
    //   id: product._id,
    //   sizes: product.sizes,
    //   totalQuantity: product.totalQuantity
    // });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 