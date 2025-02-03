import React from "react";
import Button from "@/components/common/Button";
import Image from "next/image";

interface ProductsReviewProps {
  productId: string;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  title: string;
  content: string;
  images: string[];
  helpful: number;
}

interface ReviewData {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

function ProductsReview({ productId }: ProductsReviewProps) {
  const [reviewData, setReviewData] = React.useState<ReviewData>({
    reviews: [],
    rating: 0,
    reviewCount: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`);
        const data = await response.json();
        setReviewData(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div>
      {" "}
      {/* Reviews Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star${
                      i + 1 > reviewData.rating ? "-half-alt" : ""
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-gray-600">
                Based on {reviewData.reviewCount} reviews
              </span>
            </div>
          </div>
          <Button variant="primary">Write a Review</Button>
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            {Object.entries(reviewData.ratingDistribution)
              .reverse()
              .map(([rating, percentage]) => (
                <div key={rating} className="flex items-center gap-4">
                  <span className="w-16">{rating} stars</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-right">{percentage}%</span>
                </div>
              ))}
          </div>

          {/* Review Highlights */}
          <div>
            <h3 className="font-semibold mb-4">Review Highlights</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Comfortable (45)
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Stylish (38)
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Great Quality (32)
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                True to Size (28)
              </span>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-8">
          {reviewData.reviews.map((review) => (
            <div key={review.id} className="border-t pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{review.user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    <span>Verified Purchase</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
              <h5 className="font-semibold mb-2">{review.title}</h5>
              <p className="text-gray-600 mb-4">{review.content}</p>
              {review.images.length > 0 && (
                <div className="flex gap-4 mb-4">
                  {review.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 text-gray-600 hover:text-black">
                  <i className="far fa-thumbs-up"></i>
                  Helpful ({review.helpful})
                </button>
                <button className="text-gray-600 hover:text-black">
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Reviews */}
        <div className="text-center mt-8">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </div>
    </div>
  );
}

export default ProductsReview;
