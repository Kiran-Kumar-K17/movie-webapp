import React from "react";
import { Routes, BrowserRouter, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import MoviePage from "./MoviePage";
import TvshowPage from "./TvshowPage";
import SearchBar from "./SearchBar";
import "./NavbarComponent.css";
import SearchResults from "./SearchResults";
const NavbarComponent = () => {
  return (
    <div>
      <BrowserRouter>
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/tvshows">TV Shows</Link>
          <SearchBar className="search-bar" />
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/tvshows" element={<TvshowPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default NavbarComponent;
