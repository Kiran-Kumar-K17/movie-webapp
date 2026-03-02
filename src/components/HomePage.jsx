import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./HomePage.css";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);

  const movieRef = useRef(null);
  const tvRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const movieRes = await tmdb.get("/trending/movie/day");
        const tvRes = await tmdb.get("/trending/tv/day");

        setTrendingMovies(movieRes.data.results);
        setTrendingTV(tvRes.data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* 🔥 Trending Movies */}
      <div className="row-container">
        <h2 className="section-title">Trending Movies</h2>

        <div className="scroll-wrapper">
          <button
            className="scroll-btn left"
            onClick={() =>
              movieRef.current.scrollBy({
                left: -400,
                behavior: "smooth",
              })
            }
          >
            ◀
          </button>

          <div className="horizontal-scroll" ref={movieRef}>
            {trendingMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>

          <button
            className="scroll-btn right"
            onClick={() =>
              movieRef.current.scrollBy({
                left: 400,
                behavior: "smooth",
              })
            }
          >
            ▶
          </button>
        </div>
      </div>

      {/* 📺 Trending TV Shows */}
      <div className="row-container">
        <h2 className="section-title">Trending TV Shows</h2>

        <div className="scroll-wrapper">
          <button
            className="scroll-btn left"
            onClick={() =>
              tvRef.current.scrollBy({
                left: -400,
                behavior: "smooth",
              })
            }
          >
            ◀
          </button>

          <div className="horizontal-scroll" ref={tvRef}>
            {trendingTV.map((show) => (
              <div key={show.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                />
                <p>{show.name}</p>
              </div>
            ))}
          </div>

          <button
            className="scroll-btn right"
            onClick={() =>
              tvRef.current.scrollBy({
                left: 400,
                behavior: "smooth",
              })
            }
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
