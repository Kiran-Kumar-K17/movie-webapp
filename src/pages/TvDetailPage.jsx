import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getTvDetails, getTvCredits, getTvVideos,
  getSimilarTv, getBackdropUrl, getPosterUrl, getProfileUrl
} from '../api/tmdb';
import { Heart, Bookmark, Play, Star, Clock, Calendar, Globe, Tv } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/ui/StarRating';
import TrailerModal from '../components/ui/TrailerModal';
import MediaRow from '../components/ui/MediaRow';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import './DetailPage.css';

const TvDetailPage = () => {
  const { id } = useParams();
  const [show, setShow]        = useState(null);
  const [credits, setCredits]  = useState(null);
  const [trailerKey, setTK]    = useState(null);
  const [similar, setSimilar]  = useState([]);
  const [loading, setLoading]  = useState(true);
  const [showModal, setModal]  = useState(false);
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useFavorites();
  const { addToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dRes, cRes, vRes, sRes] = await Promise.all([
          getTvDetails(id),
          getTvCredits(id),
          getTvVideos(id),
          getSimilarTv(id),
        ]);
        setShow(dRes.data);
        setCredits(cRes.data);
        setSimilar(sRes.data.results);
        const yt = vRes.data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
        if (yt) setTK(yt.key);
      } catch (err) {
        console.error('TvDetailPage error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <LoadingSkeleton variant="detail" />;
  if (!show)   return <div className="page-wrapper container" style={{ paddingTop: 120 }}>Show not found.</div>;

  const backdrop = getBackdropUrl(show.backdrop_path);
  const poster   = getPosterUrl(show.poster_path);
  const title    = show.name;
  const year     = show.first_air_date?.split('-')[0];
  const rating   = show.vote_average?.toFixed(1);
  const genres   = show.genres || [];
  const cast     = credits?.cast?.slice(0, 12) || [];
  const creators = show.created_by || [];
  const seasons  = show.seasons?.filter((s) => s.season_number > 0) || [];
  const favActive   = isFavorite(show.id);
  const watchActive = isInWatchlist(show.id);
  const mediaItem = { ...show, media_type: 'tv' };
  const ratingColor = rating >= 7 ? 'var(--clr-rating-hi)' : rating >= 5 ? 'var(--clr-rating-mid)' : 'var(--clr-rating-lo)';

  return (
    <>
      <div className="detail-page">
        <div className="detail-page__backdrop" style={{ backgroundImage: backdrop ? `url(${backdrop})` : 'none' }}>
          <div className="detail-page__backdrop-gradient" />
        </div>

        <div className="detail-page__content container">
          <div className="detail-page__main">
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

            <div className="detail-page__info">
              <div className="detail-page__badge-row">
                <span className="detail-page__genre" style={{ background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: '#818cf8' }}>
                  <Tv size={11} style={{ display: 'inline', marginRight: 4 }} />TV Series
                </span>
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
                    <span className="detail-page__vote-count">({show.vote_count?.toLocaleString()} votes)</span>
                  </span>
                )}
                {year && <span className="detail-page__meta-item"><Calendar size={13} /> {year}</span>}
                {show.episode_run_time?.[0] && (
                  <span className="detail-page__meta-item"><Clock size={13} /> {show.episode_run_time[0]}min / ep</span>
                )}
              </div>

              {show.tagline && <p className="detail-page__tagline">"{show.tagline}"</p>}

              <div className="detail-page__section">
                <h3>Overview</h3>
                <p className="detail-page__overview">{show.overview || 'No overview available.'}</p>
              </div>

              {creators.length > 0 && (
                <div className="detail-page__section">
                  <h3>Created By</h3>
                  <p className="detail-page__credits-names">{creators.map((c) => c.name).join(', ')}</p>
                </div>
              )}

              {seasons.length > 0 && (
                <div className="detail-page__section">
                  <h3>Seasons ({seasons.length})</h3>
                  <div className="detail-page__seasons">
                    {seasons.slice(0, 12).map((s) => (
                      <span key={s.id} className="detail-page__season-badge">
                        S{s.season_number}: {s.episode_count} eps
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-page__stats">
                {show.status && (
                  <div className="detail-page__stat">
                    <span className="detail-page__stat-label">Status</span>
                    <span className="detail-page__stat-val">{show.status}</span>
                  </div>
                )}
                {show.original_language && (
                  <div className="detail-page__stat">
                    <Globe size={14} />
                    <span className="detail-page__stat-label">Language</span>
                    <span className="detail-page__stat-val">{show.original_language.toUpperCase()}</span>
                  </div>
                )}
                {show.number_of_episodes && (
                  <div className="detail-page__stat">
                    <span className="detail-page__stat-label">Episodes</span>
                    <span className="detail-page__stat-val">{show.number_of_episodes}</span>
                  </div>
                )}
              </div>

              <div className="detail-page__cta-row">
                {trailerKey && (
                  <button className="detail-page__trailer-btn" onClick={() => setModal(true)}>
                    <Play size={18} fill="currentColor" />
                    Watch Trailer
                  </button>
                )}
                {show.homepage && (
                  <a href={show.homepage} target="_blank" rel="noopener noreferrer" className="detail-page__site-btn">
                    <Globe size={16} />
                    Official Site
                  </a>
                )}
              </div>

              <div className="detail-page__section">
                <h3>Your Rating</h3>
                <StarRating itemId={`tv-${id}`} size="md" />
              </div>
            </div>
          </div>

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
                        <img src={getProfileUrl(person.profile_path)} alt={person.name} className="cast-card__img" loading="lazy" />
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

        {similar.length > 0 && (
          <div style={{ paddingBottom: 'var(--sp-2xl)' }}>
            <MediaRow title="Similar Shows" items={similar} mediaType="tv" />
          </div>
        )}
      </div>

      {showModal && <TrailerModal trailerKey={trailerKey} onClose={() => setModal(false)} />}
    </>
  );
};

export default TvDetailPage;
