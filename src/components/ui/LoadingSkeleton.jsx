import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton--poster" />
            <div className="skeleton-card__info">
              <div className="skeleton skeleton--line skeleton--line-full" />
              <div className="skeleton skeleton--line skeleton--line-half" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="skeleton-hero">
        <div className="skeleton skeleton--hero-img" />
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="skeleton skeleton--detail-backdrop" />
        <div className="skeleton-detail__info">
          <div className="skeleton skeleton--line" style={{ width: '60%', height: 36 }} />
          <div className="skeleton skeleton--line" style={{ width: '40%', height: 20, marginTop: 12 }} />
          <div className="skeleton skeleton--line" style={{ width: '100%', height: 16, marginTop: 24 }} />
          <div className="skeleton skeleton--line" style={{ width: '90%', height: 16, marginTop: 8 }} />
          <div className="skeleton skeleton--line" style={{ width: '70%', height: 16, marginTop: 8 }} />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
