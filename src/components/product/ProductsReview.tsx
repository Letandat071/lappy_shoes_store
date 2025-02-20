import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PhotoIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { showToast } from '@/components/common/Toast';
import { useSession } from 'next-auth/react';
import { useImageUpload } from '@/lib/cloudinary';
import { formatDate } from '@/utils/format';

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  } | null;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

interface RatingStats {
  [key: number]: number;
}

interface Stats {
  ratings: RatingStats;
  totalWithImages: number;
}

interface ProductsReviewProps {
  productId: string;
  initialReviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export default function ProductsReview({
  productId,
  initialReviews = [],
  averageRating: initialAverageRating = 0,
  totalReviews: initialTotalReviews = 0,
}: ProductsReviewProps) {
  const { data: session } = useSession();
  const { uploadImage } = useImageUpload();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalReviews, setTotalReviews] = useState(initialTotalReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Thêm state cho filters và phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [showWithImages, setShowWithImages] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [stats, setStats] = useState<Stats>({
    ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    totalWithImages: 0
  });
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});

  const fetchReviews = async (page = currentPage) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: '5',
        sortBy,
        sortOrder,
        ...(selectedRating && { rating: selectedRating }),
        ...(showWithImages && { hasImages: 'true' })
      });

      const res = await fetch(`/api/reviews?${queryParams}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
      setStats(data.stats);
      
      // Cập nhật rating tổng quan
      if (data.reviews.length > 0) {
        const total = data.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
        setAverageRating(total / data.reviews.length);
        setTotalReviews(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast.error('Không thể tải đánh giá. Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [productId, selectedRating, showWithImages, sortBy, sortOrder]);

  const handleRatingFilter = (rating: string) => {
    setSelectedRating(selectedRating === rating ? '' : rating);
    setCurrentPage(1);
  };

  const toggleImageFilter = () => {
    setShowWithImages(!showWithImages);
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    if (sortBy === sort) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(sort);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const toggleExpand = (reviewId: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleSubmitReview = async () => {
    if (!session?.user) {
      showToast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    if (!comment.trim()) {
      showToast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
          images
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          showToast.error('Bạn cần mua sản phẩm này trước khi đánh giá');
        } else {
          showToast.error(data.error || 'Có lỗi xảy ra khi gửi đánh giá');
        }
        return;
      }

      showToast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
      setIsModalOpen(false);
      setComment('');
      setRating(5);
      setImages([]);
      await fetchReviews(); // Refresh reviews list
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Kiểm tra số lượng ảnh
    if (images.length + files.length > 5) {
      showToast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Upload từng ảnh lên Cloudinary
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
      showToast.success('Tải ảnh lên thành công');
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast.error('Không thể tải ảnh lên. Vui lòng thử lại sau');
    } finally {
      setIsUploading(false);
      // Reset input file
      e.target.value = '';
    }
  };

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return (
      <div
        key={rating}
        className={`flex items-center gap-2 cursor-pointer ${
          selectedRating === rating.toString() ? 'font-semibold' : ''
        }`}
        onClick={() => handleRatingFilter(rating.toString())}
      >
        <div className="flex items-center gap-1 w-20">
          <span>{rating}</span>
          <StarIcon className="h-4 w-4 text-yellow-400" />
        </div>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-16 text-sm text-gray-500">{count}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{totalReviews} đánh giá</p>
            </div>
          </div>
          
          {/* Rating Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => renderRatingBar(rating, stats.ratings[rating]))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Filters */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Lọc đánh giá</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRatingFilter('good')}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedRating === 'good'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                Đánh giá tốt
              </button>
              <button
                onClick={() => handleRatingFilter('bad')}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedRating === 'bad'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                Đánh giá thấp
              </button>
              <button
                onClick={toggleImageFilter}
                className={`px-4 py-2 rounded-full border transition-colors flex items-center gap-2 ${
                  showWithImages
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <PhotoIcon className="h-5 w-5" />
                Có hình ảnh ({stats.totalWithImages})
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('createdAt')}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  sortBy === 'createdAt'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                Mới nhất {sortBy === 'createdAt' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSort('rating')}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  sortBy === 'rating'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                Đánh giá {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>

          {session?.user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Viết đánh giá
            </button>
          )}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={review.user?.avatar || '/images/default-avatar.png'}
                  alt={review.user?.name || 'Người dùng ẩn danh'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-medium text-gray-900">
                    {review.user?.name || 'Người dùng ẩn danh'}
                  </h3>
                  <time className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <p className={`text-gray-700 whitespace-pre-line ${
                    !isExpanded[review._id] && review.comment.length > 300
                      ? 'line-clamp-3'
                      : ''
                  }`}>
                    {review.comment}
                  </p>
                  {review.comment.length > 300 && (
                    <button
                      onClick={() => toggleExpand(review._id)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1 flex items-center"
                    >
                      {isExpanded[review._id] ? 'Thu gọn' : 'Xem thêm'}
                      <ChevronDownIcon
                        className={`h-4 w-4 ml-1 transition-transform ${
                          isExpanded[review._id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={image}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchReviews(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30 transition-opacity" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h3>
              
              {/* Rating Selection */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    {star <= (hoveredRating || rating) ? (
                      <StarIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Comment Input */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              {/* Image Upload */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thêm hình ảnh (tối đa 5 ảnh)
                </label>
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <ImageWithFallback
                        src={image}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !comment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
