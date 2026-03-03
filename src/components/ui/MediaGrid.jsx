import React from 'react';
import MovieCard from './MovieCard';

const MediaGrid = ({ items = [], mediaType, gridClass = 'media-grid' }) => {
  return (
    <div className={gridClass}>
      {items.map((item) => (
        <MovieCard
          key={item.id}
          item={item.media_type ? item : { ...item, media_type: mediaType || (item.title ? 'movie' : 'tv') }}
          variant="grid"
        />
      ))}
    </div>
  );
};

export default MediaGrid;
