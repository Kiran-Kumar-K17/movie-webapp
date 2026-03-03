import React, { useState } from 'react';
import { Star } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './StarRating.css';

const StarRating = ({ itemId, size = 'md' }) => {
  const [rating, setRating] = useLocalStorage(`mh_rating_${itemId}`, 0);
  const [hovered, setHovered] = useState(0);
  const total = 10;

  const handleSet = (val) => {
    setRating(rating === val ? 0 : val);
  };

  const displayRating = hovered || rating;

  return (
    <div className={`star-rating star-rating--${size}`}>
      <div className="star-rating__label">
        {displayRating > 0
          ? `Your Rating: ${displayRating}/10`
          : 'Rate this'}
      </div>
      <div
        className="star-rating__stars"
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: total }).map((_, i) => {
          const val = i + 1;
          const filled = val <= displayRating;
          return (
            <button
              key={val}
              className={`star-rating__star ${filled ? 'filled' : ''}`}
              onMouseEnter={() => setHovered(val)}
              onClick={() => handleSet(val)}
              aria-label={`Rate ${val} out of ${total}`}
            >
              <Star
                size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18}
                fill={filled ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
