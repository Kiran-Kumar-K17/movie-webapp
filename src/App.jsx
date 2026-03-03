import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TvShowsPage from './pages/TvShowsPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TvDetailPage from './pages/TvDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ToastProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"           element={<HomePage />} />
              <Route path="/movies"     element={<MoviesPage />} />
              <Route path="/tvshows"    element={<TvShowsPage />} />
              <Route path="/movie/:id"  element={<MovieDetailPage />} />
              <Route path="/tv/:id"     element={<TvDetailPage />} />
              <Route path="/search"     element={<SearchPage />} />
              <Route path="/favorites"  element={<FavoritesPage />} />
              {/* Fallback */}
              <Route path="*"           element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
};

export default App;
