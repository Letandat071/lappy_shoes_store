import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Đăng xuất thành công'
    });

    // Xóa cookie token
    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra khi đăng xuất' },
      { status: 500 }
    );
  }
} 