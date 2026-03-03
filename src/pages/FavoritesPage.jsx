import React, { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import MediaGrid from '../components/ui/MediaGrid';
import './MediaListPage.css';

const TABS = [
  { key: 'favorites', label: 'Favorites', icon: <Heart size={16} /> },
  { key: 'watchlist', label: 'Watchlist', icon: <Bookmark size={16} /> },
];

const FavoritesPage = () => {
  const { favorites, watchlist } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');

  const items = activeTab === 'favorites' ? favorites : watchlist;

  const counts = { favorites: favorites.length, watchlist: watchlist.length };

  const emptyMessages = {
    favorites: {
      icon: '💔',
      title: 'No favorites yet',
      desc: 'Click the heart ♥ icon on any movie or show to save it here.',
    },
    watchlist: {
      icon: '🎬',
      title: 'Your watchlist is empty',
      desc: 'Click the bookmark icon on any title to add it to your watchlist.',
    },
  };

  const empty = emptyMessages[activeTab];

  return (
    <div className="favorites-page page-wrapper">
      <div className="container">
        <div className="favorites-page__header">
          <h1 className="favorites-page__title">
            <span className="title-accent" />
            My Collection
          </h1>
        </div>

        <div className="favorites-page__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`favorites-page__tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
              <span className="favorites-page__count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-icon">{empty.icon}</div>
            <h3>{empty.title}</h3>
            <p>{empty.desc}</p>
          </div>
        ) : (
          <MediaGrid items={items} />
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
