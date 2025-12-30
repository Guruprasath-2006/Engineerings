import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, onRate, size = 'md', readonly = false, showCount = false, count = 0 }) => {
  const [hover, setHover] = React.useState(0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hover ? star <= hover : star <= rating;
        
        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => !readonly && onRate && onRate(star)}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            className={`${sizeClasses[size]} ${
              readonly ? 'cursor-default' : 'cursor-pointer'
            } transition-colors`}
          >
            <FiStar
              className={`${
                isActive ? 'fill-gold text-gold' : 'text-gray-300'
              }`}
            />
          </motion.button>
        );
      })}
      
      {showCount && (
        <span className="ml-2 text-sm text-gray-600">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;


