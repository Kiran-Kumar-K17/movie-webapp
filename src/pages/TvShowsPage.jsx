import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrending, getTvByGenre, getTvGenres } from '../api/tmdb';
import MediaGrid from '../components/ui/MediaGrid';
import GenreFilter from '../components/ui/GenreFilter';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Loader2 } from 'lucide-react';
import './MediaListPage.css';

const TvShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    getTvGenres().then((res) => setGenres(res.data.genres)).catch(console.error);
  }, []);

  useEffect(() => {
    setShows([]);
    setPage(1);
    setHasMore(true);
  }, [activeGenre]);

  useEffect(() => {
    if (!hasMore || fetchingRef.current) return;

    const fetchShows = async () => {
      try {
        fetchingRef.current = true;
        setLoading(true);
        let res;
        if (activeGenre) {
          res = await getTvByGenre(activeGenre, page);
        } else {
          res = await getTrending('tv', 'week', page);
        }
        const results = res.data.results || [];
        setShows((prev) => {
          const ids = new Set(prev.map((s) => s.id));
          return [...prev, ...results.filter((s) => !ids.has(s.id))];
        });
        if (page >= (res.data.total_pages || 1)) setHasMore(false);
      } catch (err) {
        console.error('TvShowsPage fetch error:', err);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchShows();
  }, [page, activeGenre, hasMore]);

  const observer = useRef(null);
  const sentinelRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
      },
      { threshold: 0.1 }
    );
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="media-list-page page-wrapper">
      <div className="container">
        <div className="media-list-page__header">
          <h1 className="media-list-page__title">
            <span className="title-accent" />
            TV Shows
          </h1>
          <p className="media-list-page__subtitle">Trending & by genre</p>
        </div>

        <div className="media-list-page__filters">
          <GenreFilter genres={genres} activeId={activeGenre} onChange={setActiveGenre} />
        </div>

        {shows.length === 0 && loading ? (
          <div className="media-grid">
            <LoadingSkeleton variant="card" count={20} />
          </div>
        ) : (
          <MediaGrid items={shows} mediaType="tv" />
        )}

        <div ref={sentinelRef} className="media-list-page__sentinel">
          {loading && shows.length > 0 && (
            <div className="media-list-page__loader">
              <Loader2 size={28} className="spin-icon" />
            </div>
          )}
          {!hasMore && shows.length > 0 && (
            <p className="media-list-page__end">You've seen it all — for now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TvShowsPage;
