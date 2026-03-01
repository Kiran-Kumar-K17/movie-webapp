import React from "react";
import { Routes, BrowserRouter, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import MoviePage from "./MoviePage";
import TvshowPage from "./TvshowPage";
const NavbarComponent = () => {
  return (
    <div>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/tvshows">TV Shows</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/tvshows" element={<TvshowPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default NavbarComponent;
