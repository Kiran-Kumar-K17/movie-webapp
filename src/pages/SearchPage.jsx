import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMulti } from '../api/tmdb';
import MediaGrid from '../components/ui/MediaGrid';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Loader2, Search, Film, Tv } from 'lucide-react';
import './MediaListPage.css';

const TABS = [
  { key: 'All',      label: 'All',      icon: <Search size={13} /> },
  { key: 'Movies',   label: 'Movies',   icon: <Film size={13} /> },
  { key: 'TV Shows', label: 'TV Shows', icon: <Tv size={13} /> },
];

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const fetchingRef = useRef(false);

  // Reset when query changes
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    setActiveTab('All');
  }, [query]);

  useEffect(() => {
    if (!query || !hasMore || fetchingRef.current) return;
    const doFetch = async () => {
      try {
        fetchingRef.current = true;
        setLoading(true);
        const res = await searchMulti(query, page);
        const newItems = res.data.results.filter(
          (r) => r.media_type === 'movie' || r.media_type === 'tv'
        );
        setResults((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          return [...prev, ...newItems.filter((r) => !ids.has(r.id))];
        });
        if (page >= (res.data.total_pages || 1)) setHasMore(false);
      } catch (err) {
        console.error('SearchPage error:', err);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };
    doFetch();
  }, [query, page, hasMore]);

  const observer = useRef(null);
  const sentinelRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
      },
      { threshold: 0 }
    );
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const filtered = results.filter((r) => {
    if (activeTab === 'Movies') return r.media_type === 'movie';
    if (activeTab === 'TV Shows') return r.media_type === 'tv';
    return true;
  });

  const counts = {
    All: results.length,
    Movies: results.filter((r) => r.media_type === 'movie').length,
    'TV Shows': results.filter((r) => r.media_type === 'tv').length,
  };

  return (
    <div className="search-page page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="search-page__header">
          <h1 className="search-page__title">
            <span className="title-accent" />
            Results for{' '}
            <span className="search-page__query">"{query}"</span>
          </h1>
          {!loading && results.length > 0 && (
            <p className="search-page__count">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="search-page__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`search-page__tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className="search-page__tab-count">{counts[tab.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 && loading ? (
          <div className="search-results-grid">
            <LoadingSkeleton variant="card" count={12} />
          </div>
        ) : filtered.length === 0 && !loading ? (
          <div className="search-page__empty">
            <div className="search-page__empty-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try a different search term or check your spelling.</p>
          </div>
        ) : (
          <MediaGrid items={filtered} gridClass="search-results-grid" />
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="media-list-page__sentinel">
          {loading && results.length > 0 && (
            <div className="media-list-page__loader">
              <Loader2 size={28} className="spin-icon" />
            </div>
          )}
          {!hasMore && filtered.length > 0 && (
            <p className="media-list-page__end">You've seen them all — for now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
