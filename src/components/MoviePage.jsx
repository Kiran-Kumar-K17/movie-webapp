import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./MoviePage.css";
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchMovies = async () => {
      if (loading || !hasMore) return;
      if (fetchingRef.current) return;
      try {
        fetchingRef.current = true;
        setLoading(true);
        const response = await tmdb.get("/trending/movie/day", {
          params: { page },
        });
        const newMovies = response.data.results;
        setMovies((prevMovies) => {
          const existIds = new Set(prevMovies.map((m) => m.id));
          const filteredMovies = newMovies.filter(
            (movie) => !existIds.has(movie.id),
          );
          return [...prevMovies, ...filteredMovies];
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
    fetchMovies();
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
        <h1>Movies Page</h1>
      </div>
      <div className="message-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </div>
      <div className="card-container">
        <ul className="movies-list">
          {movies.map((movie) => (
            <li key={movie.id} className="movie-item">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              )}
              <div className="movie-title">
                {movie.title} (
                {movie.release_date
                  ? movie.release_date.split("-")[0]
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

export default MoviePage;
