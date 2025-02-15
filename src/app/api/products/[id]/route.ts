import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id)
      .populate("category")
      .populate("features")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { 
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(product, { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET Product Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
} 