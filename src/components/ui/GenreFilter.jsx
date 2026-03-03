import React from 'react';
import './StarRating.css';

const GenreFilter = ({ genres = [], activeId, onChange }) => {
  return (
    <div className="genre-filter">
      <button
        className={`genre-filter__pill ${!activeId ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`genre-filter__pill ${activeId === g.id ? 'active' : ''}`}
          onClick={() => onChange(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
