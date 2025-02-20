import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Đảm bảo mỗi user chỉ đánh giá một sản phẩm một lần
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Middleware để cập nhật rating trung bình của sản phẩm
reviewSchema.post('save', async function(doc) {
  const Product = mongoose.model('Product');
  const reviews = await mongoose.model('Review').find({ product: doc.product });
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  await Product.findByIdAndUpdate(doc.product, {
    rating: averageRating,
    reviewCount: reviews.length
  });
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;