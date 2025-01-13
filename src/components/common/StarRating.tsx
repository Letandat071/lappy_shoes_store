import React from 'react';

interface StarRatingProps {
  rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex text-yellow-400 text-sm">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <i key={index} className="fas fa-star" />;
        } else if (index === fullStars && hasHalfStar) {
          return <i key={index} className="fas fa-star-half-alt" />;
        } else {
          return <i key={index} className="far fa-star" />;
        }
      })}
    </div>
  );
}; 