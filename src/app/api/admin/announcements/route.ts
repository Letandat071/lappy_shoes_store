import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AnnouncementBar from '@/models/AnnouncementBar';
import { getDataFromToken } from '@/helpers/getDataFromToken';

// GET: Lấy danh sách thông báo
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Lấy tất cả thông báo, sắp xếp giảm dần theo thời gian cập nhật
    const announcements = await AnnouncementBar.find().sort({ updatedAt: -1 });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Tạo mới thông báo
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const { message, link, backgroundColor, textColor, isActive, startDate, endDate } = data;

    if (!message) {
      return NextResponse.json({ error: 'Thiếu nội dung thông báo' }, { status: 400 });
    }
    
    const announcement = await AnnouncementBar.create({
      message,
      link,
      backgroundColor: backgroundColor || '#000000',
      textColor: textColor || '#FFFFFF',
      isActive: typeof isActive === 'boolean' ? isActive : true,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Cập nhật thông báo
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const { announcementId, message, link, backgroundColor, textColor, isActive, startDate, endDate } = data;
    
    if (!announcementId || !message) {
      return NextResponse.json({ error: 'Thiếu thông tin cập nhật' }, { status: 400 });
    }
    
    const announcement = await AnnouncementBar.findById(announcementId);
    if (!announcement) {
      return NextResponse.json({ error: 'Thông báo không tồn tại' }, { status: 404 });
    }
    
    announcement.message = message;
    announcement.link = link;
    announcement.backgroundColor = backgroundColor || announcement.backgroundColor;
    announcement.textColor = textColor || announcement.textColor;
    announcement.isActive = typeof isActive === 'boolean' ? isActive : announcement.isActive;
    announcement.startDate = startDate ? new Date(startDate) : announcement.startDate;
    announcement.endDate = endDate ? new Date(endDate) : announcement.endDate;
    announcement.updatedAt = new Date();
    
    await announcement.save();
    
    return NextResponse.json({ announcement });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Xóa thông báo
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { announcementId } = data;
    
    if (!announcementId) {
      return NextResponse.json({ error: 'Thiếu announcementId' }, { status: 400 });
    }
    
    const announcement = await AnnouncementBar.findByIdAndDelete(announcementId);
    if (!announcement) {
      return NextResponse.json({ error: 'Thông báo không tồn tại' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Xóa thông báo thành công' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 