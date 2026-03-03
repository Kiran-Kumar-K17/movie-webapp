import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Heart, Bookmark, Star } from 'lucide-react';
import { getBackdropUrl } from '../../api/tmdb';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import TrailerModal from './TrailerModal';
import './HeroSection.css';

const HeroSection = ({ item, trailerKey, loading }) => {
  const navigate = useNavigate();
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useFavorites();
  const { addToast } = useToast();
  const [showTrailer, setShowTrailer] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    setBgLoaded(false);
  }, [item?.id]);

  if (loading || !item) {
    return <div className="hero hero--loading" />;
  }

  const title = item.title || item.name || '';
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const overview = item.overview || '';
  const rating = item.vote_average?.toFixed(1);
  const year = (item.release_date || item.first_air_date || '').split('-')[0];
  const backdrop = getBackdropUrl(item.backdrop_path);
  const favActive = isFavorite(item.id);
  const watchActive = isInWatchlist(item.id);

  const handleFav = () => {
    toggleFavorite({ ...item, media_type: mediaType });
    addToast(
      favActive ? 'Removed from favorites' : `Added "${title}" to favorites`,
      favActive ? 'info' : 'success'
    );
  };

  const handleWatch = () => {
    toggleWatchlist({ ...item, media_type: mediaType });
    addToast(
      watchActive ? 'Removed from watchlist' : `Added "${title}" to watchlist`,
      watchActive ? 'info' : 'success'
    );
  };

  return (
    <>
      <section className="hero">
        {backdrop && (
          <div className={`hero__bg ${bgLoaded ? 'loaded' : ''}`}>
            <img
              src={backdrop}
              alt=""
              aria-hidden="true"
              onLoad={() => setBgLoaded(true)}
            />
          </div>
        )}

        <div className="hero__gradient" />

        <div className="hero__content container">
          <div className="hero__meta animate-fadeUp">
            <span className="hero__type">{mediaType === 'movie' ? '🎬 Movie' : '📺 TV Show'}</span>
            {year && <span className="hero__year">{year}</span>}
            {rating && (
              <span className="hero__rating">
                <Star size={13} fill="currentColor" />
                {rating}
              </span>
            )}
          </div>

          <h1 className="hero__title animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>

          {overview && (
            <p className="hero__overview animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              {overview.length > 200 ? overview.slice(0, 200) + '…' : overview}
            </p>
          )}

          <div className="hero__actions animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            {trailerKey && (
              <button
                className="hero__btn hero__btn--primary"
                onClick={() => setShowTrailer(true)}
              >
                <Play size={18} fill="currentColor" />
                Watch Trailer
              </button>
            )}
            <button
              className="hero__btn hero__btn--secondary"
              onClick={() => navigate(`/${mediaType === 'movie' ? 'movie' : 'tv'}/${item.id}`)}
            >
              <Info size={18} />
              More Info
            </button>
            <button
              className={`hero__btn hero__btn--icon ${favActive ? 'active-fav' : ''}`}
              onClick={handleFav}
              aria-label="Toggle favorite"
            >
              <Heart size={18} fill={favActive ? 'currentColor' : 'none'} />
            </button>
            <button
              className={`hero__btn hero__btn--icon ${watchActive ? 'active-watch' : ''}`}
              onClick={handleWatch}
              aria-label="Toggle watchlist"
            >
              <Bookmark size={18} fill={watchActive ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint">
          <div className="hero__scroll-dot" />
        </div>
      </section>

      {showTrailer && (
        <TrailerModal trailerKey={trailerKey} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
};

export default HeroSection;
