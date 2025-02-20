import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongoose';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: Lấy danh sách đánh giá của một sản phẩm
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const rating = searchParams.get('rating');
    const hasImages = searchParams.get('hasImages');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Xây dựng query filters
    const filters: any = { product: productId };
    
    // Lọc theo rating
    if (rating) {
      if (rating === 'good') {
        filters.rating = { $gte: 4 };
      } else if (rating === 'bad') {
        filters.rating = { $lte: 2 };
      } else {
        filters.rating = parseInt(rating);
      }
    }

    // Lọc reviews có hình ảnh
    if (hasImages === 'true') {
      filters.images = { $exists: true, $ne: [] };
    }

    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;

    // Đếm tổng số reviews theo filter
    const total = await Review.countDocuments(filters);

    // Lấy reviews với sorting và phân trang
    const reviews = await Review.find(filters)
      .populate('user', 'name avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Tính toán thống kê ratings
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats thành object dễ sử dụng
    const ratingStats = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    stats.forEach(stat => {
      ratingStats[stat._id] = stat.count;
    });

    // Đếm số reviews có hình ảnh
    const totalWithImages = await Review.countDocuments({
      product: productId,
      images: { $exists: true, $ne: [] }
    });

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      },
      stats: {
        ratings: ratingStats,
        totalWithImages
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Tạo đánh giá mới
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, rating, comment, images } = await request.json();

    // Validate input
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Kiểm tra user đã mua sản phẩm chưa
    const hasPurchased = await Order.findOne({
      user: session.user.id,
      'items.product': productId,
      status: 'delivered' // Chỉ cho phép đánh giá khi đơn hàng đã giao thành công
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'Bạn cần mua sản phẩm trước khi đánh giá' },
        { status: 403 }
      );
    }

    // Kiểm tra user đã đánh giá sản phẩm chưa
    const existingReview = await Review.findOne({
      user: session.user.id,
      product: productId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Bạn đã đánh giá sản phẩm này rồi' },
        { status: 400 }
      );
    }

    // Tạo đánh giá mới
    const review = await Review.create({
      user: session.user.id,
      product: productId,
      rating,
      comment,
      images: images || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Populate user info cho response
    await review.populate('user', 'name avatar');

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH: Cập nhật đánh giá
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reviewId, rating, comment, images } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Kiểm tra đánh giá tồn tại và thuộc về user
    const review = await Review.findOne({
      _id: reviewId,
      user: session.user.id
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Cập nhật đánh giá
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (images) review.images = images;
    review.updatedAt = new Date();

    await review.save();
    await review.populate('user', 'name avatar');

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Xóa đánh giá
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Kiểm tra đánh giá tồn tại và thuộc về user
    const review = await Review.findOne({
      _id: reviewId,
      user: session.user.id
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    await review.deleteOne();

    return NextResponse.json(
      { message: 'Review deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 