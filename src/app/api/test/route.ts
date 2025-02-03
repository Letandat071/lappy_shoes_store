import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: 'Kết nối MongoDB thành công!' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 