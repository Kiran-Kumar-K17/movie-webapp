import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    const fetchSearch = async () => {
      const response = await tmdb.get("/search/movie", {
        params: { query },
      });

      setResults(response.data.results);
    };

    fetchSearch();
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {results.map((movie) => (
          <div key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
