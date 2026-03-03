import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMovieDetails, getMovieCredits, getMovieVideos,
  getSimilarMovies, getBackdropUrl, getPosterUrl, getProfileUrl
} from '../api/tmdb';
import { Heart, Bookmark, Play, Star, Clock, Calendar, DollarSign, Globe } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/ui/StarRating';
import TrailerModal from '../components/ui/TrailerModal';
import MediaRow from '../components/ui/MediaRow';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import './DetailPage.css';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useFavorites();
  const { addToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dRes, cRes, vRes, sRes] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getSimilarMovies(id),
        ]);
        setMovie(dRes.data);
        setCredits(cRes.data);
        setSimilar(sRes.data.results);
        const yt = vRes.data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
        if (yt) setTrailerKey(yt.key);
      } catch (err) {
        console.error('MovieDetailPage error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <LoadingSkeleton variant="detail" />;
  if (!movie) return <div className="page-wrapper container" style={{ paddingTop: 120 }}>Movie not found.</div>;

  const backdrop = getBackdropUrl(movie.backdrop_path);
  const poster = getPosterUrl(movie.poster_path);
  const title = movie.title;
  const year = movie.release_date?.split('-')[0];
  const rating = movie.vote_average?.toFixed(1);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const genres = movie.genres || [];
  const cast = credits?.cast?.slice(0, 12) || [];
  const directors = credits?.crew?.filter((c) => c.job === 'Director') || [];
  const favActive = isFavorite(movie.id);
  const watchActive = isInWatchlist(movie.id);
  const mediaItem = { ...movie, media_type: 'movie' };

  const fmt = (n) => n ? `$${(n / 1e6).toFixed(1)}M` : 'N/A';
  const ratingColor = rating >= 7 ? 'var(--clr-rating-hi)' : rating >= 5 ? 'var(--clr-rating-mid)' : 'var(--clr-rating-lo)';

  return (
    <>
      <div className="detail-page">
        {/* Backdrop */}
        <div className="detail-page__backdrop" style={{ backgroundImage: backdrop ? `url(${backdrop})` : 'none' }}>
          <div className="detail-page__backdrop-gradient" />
        </div>

        <div className="detail-page__content container">
          <div className="detail-page__main">
            {/* Poster */}
            {poster && (
              <div className="detail-page__poster-wrap">
                <img className="detail-page__poster" src={poster} alt={title} />
                <div className="detail-page__poster-actions">
                  <button
                    className={`detail-page__action-btn ${favActive ? 'active-fav' : ''}`}
                    onClick={() => { toggleFavorite(mediaItem); addToast(favActive ? 'Removed from favorites' : `Added "${title}" to favorites`, favActive ? 'info' : 'success'); }}
                  >
                    <Heart size={16} fill={favActive ? 'currentColor' : 'none'} />
                    {favActive ? 'Favorited' : 'Favorite'}
                  </button>
                  <button
                    className={`detail-page__action-btn ${watchActive ? 'active-watch' : ''}`}
                    onClick={() => { toggleWatchlist(mediaItem); addToast(watchActive ? 'Removed from watchlist' : `Added "${title}" to watchlist`, watchActive ? 'info' : 'success'); }}
                  >
                    <Bookmark size={16} fill={watchActive ? 'currentColor' : 'none'} />
                    {watchActive ? 'In Watchlist' : 'Watchlist'}
                  </button>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="detail-page__info">
              <div className="detail-page__badge-row">
                {genres.map((g) => (
                  <span key={g.id} className="detail-page__genre">{g.name}</span>
                ))}
              </div>

              <h1 className="detail-page__title">{title}</h1>

              <div className="detail-page__meta">
                {rating && (
                  <span className="detail-page__meta-item rating" style={{ color: ratingColor }}>
                    <Star size={14} fill="currentColor" />
                    {rating} <span style={{ color: 'var(--clr-text-muted)', fontWeight: 400 }}>/ 10</span>
                    <span className="detail-page__vote-count">({movie.vote_count?.toLocaleString()} votes)</span>
                  </span>
                )}
                {year && <span className="detail-page__meta-item"><Calendar size={13} /> {year}</span>}
                {runtime && <span className="detail-page__meta-item"><Clock size={13} /> {runtime}</span>}
              </div>

              {movie.tagline && (
                <p className="detail-page__tagline">"{movie.tagline}"</p>
              )}

              <div className="detail-page__section">
                <h3>Overview</h3>
                <p className="detail-page__overview">{movie.overview || 'No overview available.'}</p>
              </div>

              {directors.length > 0 && (
                <div className="detail-page__section">
                  <h3>Director{directors.length > 1 ? 's' : ''}</h3>
                  <p className="detail-page__credits-names">{directors.map((d) => d.name).join(', ')}</p>
                </div>
              )}

              <div className="detail-page__stats">
                {movie.budget > 0 && (
                  <div className="detail-page__stat">
                    <DollarSign size={14} />
                    <span className="detail-page__stat-label">Budget</span>
                    <span className="detail-page__stat-val">{fmt(movie.budget)}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="detail-page__stat">
                    <DollarSign size={14} />
                    <span className="detail-page__stat-label">Revenue</span>
                    <span className="detail-page__stat-val">{fmt(movie.revenue)}</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="detail-page__stat">
                    <Globe size={14} />
                    <span className="detail-page__stat-label">Language</span>
                    <span className="detail-page__stat-val">{movie.original_language.toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="detail-page__cta-row">
                {trailerKey && (
                  <button className="detail-page__trailer-btn" onClick={() => setShowTrailer(true)}>
                    <Play size={18} fill="currentColor" />
                    Watch Trailer
                  </button>
                )}
                {movie.homepage && (
                  <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="detail-page__site-btn">
                    <Globe size={16} />
                    Official Site
                  </a>
                )}
              </div>

              {/* User Rating */}
              <div className="detail-page__section">
                <h3>Your Rating</h3>
                <StarRating itemId={`movie-${id}`} size="md" />
              </div>
            </div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <section className="detail-page__cast">
              <h2 className="detail-page__section-title">
                <span className="title-accent" /> Cast
              </h2>
              <div className="detail-page__cast-scroll">
                {cast.map((person) => (
                  <div key={person.id} className="cast-card">
                    <div className="cast-card__img-wrap">
                      {person.profile_path ? (
                        <img
                          src={getProfileUrl(person.profile_path)}
                          alt={person.name}
                          className="cast-card__img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="cast-card__no-img">
                          {person.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <p className="cast-card__name">{person.name}</p>
                    <p className="cast-card__role">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Similar movies */}
        {similar.length > 0 && (
          <div style={{ paddingBottom: 'var(--sp-2xl)' }}>
            <MediaRow title="Similar Movies" items={similar} mediaType="movie" />
          </div>
        )}
      </div>

      {showTrailer && <TrailerModal trailerKey={trailerKey} onClose={() => setShowTrailer(false)} />}
    </>
  );
};

export default MovieDetailPage;
