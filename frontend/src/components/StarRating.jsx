// File Path: frontend/src/components/StarRating.jsx

import { useState } from 'react';
import { Star } from 'lucide-react';

// A reusable star rating component
export default function StarRating({ rating, onRatingChange, totalStars = 5, size = 20 }) {
    const [hover, setHover] = useState(0);

    const isClickable = !!onRatingChange;

    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <label key={index}>
                        {isClickable && (
                            <input
                                type="radio"
                                name="rating"
                                value={starValue}
                                onClick={() => onRatingChange(starValue)}
                                className="hidden"
                            />
                        )}
                        <Star
                            className={`cursor-${isClickable ? 'pointer' : 'default'} transition-colors`}
                            color="#ffc107" // Yellow star color
                            fill={starValue <= (hover || rating) ? "#ffc107" : "none"}
                            size={size}
                            onMouseEnter={isClickable ? () => setHover(starValue) : undefined}
                            onMouseLeave={isClickable ? () => setHover(0) : undefined}
                        />
                    </label>
                );
            })}
        </div>
    );
};