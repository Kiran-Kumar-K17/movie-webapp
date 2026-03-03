import React from 'react';
import MovieCard from './MovieCard';
import './MediaRow.css';

const MediaGrid = ({ items = [], mediaType }) => {
  return (
    <div className="media-grid">
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
