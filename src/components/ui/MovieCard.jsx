import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Star, Film } from 'lucide-react';
import { getPosterUrl } from '../../api/tmdb';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import './MovieCard.css';

const MovieCard = ({ item, variant = 'row' }) => {
  const navigate = useNavigate();
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useFavorites();
  const { addToast } = useToast();

  if (!item) return null;

  const title = item.title || item.name || 'Unknown';
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const year = (item.release_date || item.first_air_date || '').split('-')[0];
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const posterUrl = getPosterUrl(item.poster_path);
  const favActive = isFavorite(item.id);
  const watchActive = isInWatchlist(item.id);

  const handleClick = (e) => {
    if (e.target.closest('.movie-card__action-btn')) return;
    navigate(`/${mediaType === 'movie' ? 'movie' : 'tv'}/${item.id}`);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite({ ...item, media_type: mediaType });
    addToast(
      favActive ? `Removed from favorites` : `Added "${title}" to favorites`,
      favActive ? 'info' : 'success'
    );
  };

  const handleWatch = (e) => {
    e.stopPropagation();
    toggleWatchlist({ ...item, media_type: mediaType });
    addToast(
      watchActive ? `Removed from watchlist` : `Added "${title}" to watchlist`,
      watchActive ? 'info' : 'success'
    );
  };

  return (
    <div
      className={`movie-card ${variant === 'grid' ? 'movie-card--grid' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      aria-label={`View ${title}`}
    >
      <div className="movie-card__poster-wrap">
        {posterUrl ? (
          <img
            className="movie-card__poster"
            src={posterUrl}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__no-poster">
            <Film size={32} />
            <span>No Image</span>
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="movie-card__rating">
            <Star size={10} fill="currentColor" />
            {rating}
          </div>
        )}

        {/* Action buttons */}
        <div className="movie-card__actions">
          <button
            className={`movie-card__action-btn fav ${favActive ? 'active' : ''}`}
            onClick={handleFav}
            aria-label={favActive ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={13} fill={favActive ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`movie-card__action-btn watch ${watchActive ? 'active' : ''}`}
            onClick={handleWatch}
            aria-label={watchActive ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Bookmark size={13} fill={watchActive ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <p className="movie-card__overlay-title">{title}</p>
          <div className="movie-card__overlay-meta">
            <span className="movie-card__overlay-type">{mediaType}</span>
            {year && <span>{year}</span>}
          </div>
        </div>
      </div>

      <div className="movie-card__info">
        <p className="movie-card__title">{title}</p>
        {year && <p className="movie-card__year">{year}</p>}
      </div>
    </div>
  );
};

export default MovieCard;
