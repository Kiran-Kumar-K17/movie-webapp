import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrending, getMoviesByGenre, getMovieGenres } from '../api/tmdb';
import MediaGrid from '../components/ui/MediaGrid';
import GenreFilter from '../components/ui/GenreFilter';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Loader2 } from 'lucide-react';
import './MediaListPage.css';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);
  const loaderRef = useRef(null);

  // Fetch genres once
  useEffect(() => {
    getMovieGenres().then((res) => setGenres(res.data.genres)).catch(console.error);
  }, []);

  // Reset on genre change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [activeGenre]);

  // Fetch movies
  useEffect(() => {
    if (!hasMore || fetchingRef.current) return;

    const fetchMovies = async () => {
      try {
        fetchingRef.current = true;
        setLoading(true);
        let res;
        if (activeGenre) {
          res = await getMoviesByGenre(activeGenre, page);
        } else {
          res = await getTrending('movie', 'week', page);
        }
        const results = res.data.results || [];
        setMovies((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          return [...prev, ...results.filter((m) => !ids.has(m.id))];
        });
        if (page >= (res.data.total_pages || 1)) setHasMore(false);
      } catch (err) {
        console.error('MoviesPage fetch error:', err);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchMovies();
  }, [page, activeGenre, hasMore]);

  // Intersection observer for infinite scroll
  const observer = useRef(null);
  const sentinelRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleGenreChange = (id) => {
    setActiveGenre(id);
  };

  return (
    <div className="media-list-page page-wrapper">
      <div className="container">
        <div className="media-list-page__header">
          <h1 className="media-list-page__title">
            <span className="title-accent" />
            Movies
          </h1>
          <p className="media-list-page__subtitle">Trending & by genre</p>
        </div>

        <div className="media-list-page__filters">
          <GenreFilter genres={genres} activeId={activeGenre} onChange={handleGenreChange} />
        </div>

        {movies.length === 0 && loading ? (
          <div className="media-grid">
            <LoadingSkeleton variant="card" count={20} />
          </div>
        ) : (
          <MediaGrid items={movies} mediaType="movie" />
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="media-list-page__sentinel">
          {loading && movies.length > 0 && (
            <div className="media-list-page__loader">
              <Loader2 size={28} className="spin-icon" />
            </div>
          )}
          {!hasMore && movies.length > 0 && (
            <p className="media-list-page__end">You've seen it all — for now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
