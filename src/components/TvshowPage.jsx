import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./TvshowPage.css";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

const TvshowPage = () => {
  const [tvshows, setTvshows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchTvshows = async () => {
      if (loading || !hasMore) return;
      if (fetchingRef.current) return;
      try {
        fetchingRef.current = true;
        setLoading(true);
        const response = await tmdb.get("/trending/tv/day", {
          params: { page },
        });
        const newTvshows = response.data.results;
        setTvshows((prevTvshows) => {
          const existIds = new Set(prevTvshows.map((t) => t.id));
          const filteredTvshows = newTvshows.filter(
            (tvshow) => !existIds.has(tvshow.id),
          );
          return [...prevTvshows, ...filteredTvshows];
        });

        if (response.data.total_pages && page >= response.data.total_pages) {
          setHasMore(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };
    fetchTvshows();
  }, [page, hasMore]);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 200;
    if (scrollPosition >= threshold) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <div className="main-container">
        <h1>TV Shows Page</h1>
      </div>
      <div className="message-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </div>
      <div className="card-container">
        <ul className="tvshows-list">
          {tvshows.map((tvshow) => (
            <li key={tvshow.id} className="tvshow-item">
              {tvshow.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                  alt={tvshow.name}
                  className="tvshow-poster"
                />
              )}
              <div className="tvshow-title">
                {tvshow.name} (
                {tvshow.first_air_date
                  ? tvshow.first_air_date.split("-")[0]
                  : "Unknown"}
                )
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TvshowPage;
