import React, { useState, useEffect } from "react";
import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await tmdb.get("/movie/popular");
        setMovies(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
  return (
    <div>
      <div className="main-container">
        <h1>Home Page</h1>
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
