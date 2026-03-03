import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import LoadingSkeleton from './LoadingSkeleton';
import './MediaRow.css';

const MediaRow = ({ title, items = [], loading = false, seeAllLink, mediaType }) => {
  const scrollRef = useRef(null);
  const skeletons = Array.from({ length: 8 });

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 350, behavior: 'smooth' });
  };

  return (
    <section className="media-row">
      <div className="media-row__header">
        <h2 className="media-row__title">
          <span className="media-row__title-accent" />
          {title}
        </h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="media-row__see-all">
            See All →
          </Link>
        )}
      </div>

      <div className="media-row__scroll-wrapper">
        <button
          className="media-row__arrow media-row__arrow--left"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="media-row__track" ref={scrollRef}>
          {loading
            ? skeletons.map((_, i) => <LoadingSkeleton key={i} variant="card" />)
            : items.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item.media_type ? item : { ...item, media_type: mediaType || (item.title ? 'movie' : 'tv') }}
                  variant="row"
                />
              ))}
        </div>

        <button
          className="media-row__arrow media-row__arrow--right"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
};

export default MediaRow;
