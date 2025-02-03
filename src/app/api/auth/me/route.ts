import { NextResponse } from 'next/server';
import * as jose from 'jose';
import User from '../../../../models/User';
import connectDB from '../../../../lib/mongoose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Cookie')?.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Không tìm thấy token' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;
    
    await connectDB();
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra khi lấy thông tin người dùng' },
      { status: 500 }
    );
  }
} 