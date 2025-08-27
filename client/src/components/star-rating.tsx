import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = false,
  className = "",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} data-testid="star-rating">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isPartiallyFilled = starValue > rating && starValue - 1 < rating;

          return (
            <div key={index} className="relative" data-testid={`star-${index + 1}`}>
              <Star
                className={`${sizeClasses[size]} text-gray-300`}
                fill="currentColor"
              />
              {(isFilled || isPartiallyFilled) && (
                <Star
                  className={`${sizeClasses[size]} absolute inset-0 text-yellow-400 star-rating`}
                  fill="currentColor"
                  style={{
                    clipPath: isPartiallyFilled
                      ? `inset(0 ${100 - ((rating - (starValue - 1)) * 100)}% 0 0)`
                      : undefined,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1" data-testid="rating-number">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
