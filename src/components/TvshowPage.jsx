import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await tmdb.get("/tv/popular");
        setTvshows(response.data.results);
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
        <h1>TV Shows Page</h1>
      </div>
      <div className="message-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </div>
      <div className="card-container">
        <ul className="tv-list">
          {tvshows.map((tv) => (
            <li key={tv.id} className="tv-item">
              {tv.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={tv.name}
                  className="tv-poster"
                />
              )}
              <div className="tv-title">
                {tv.name} (
                {tv.first_air_date
                  ? tv.first_air_date.split("-")[0]
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
