import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

const load = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => load('mh_favorites'));
  const [watchlist, setWatchlist] = useState(() => load('mh_watchlist'));

  useEffect(() => {
    localStorage.setItem('mh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mh_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const isFavorite = (id) => favorites.some((m) => m.id === id);
  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      isFavorite(item.id)
        ? prev.filter((m) => m.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleWatchlist = (item) => {
    setWatchlist((prev) =>
      isInWatchlist(item.id)
        ? prev.filter((m) => m.id !== item.id)
        : [...prev, item]
    );
  };

  const removeFromFavorites = (id) =>
    setFavorites((prev) => prev.filter((m) => m.id !== id));

  const removeFromWatchlist = (id) =>
    setWatchlist((prev) => prev.filter((m) => m.id !== id));

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        watchlist,
        isFavorite,
        isInWatchlist,
        toggleFavorite,
        toggleWatchlist,
        removeFromFavorites,
        removeFromWatchlist,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
};

export default FavoritesContext;
