import React, { useState, useEffect } from 'react';
import { getTrending, getTopRatedMovies, getTopRatedTv, getMovieVideos } from '../api/tmdb';
import HeroSection from '../components/ui/HeroSection';
import MediaRow from '../components/ui/MediaRow';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTv, setTopTv] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setRowsLoading(true);
        const [tMovies, tTv, trMovies, trTv] = await Promise.all([
          getTrending('movie', 'day'),
          getTrending('tv', 'day'),
          getTopRatedMovies(),
          getTopRatedTv(),
        ]);

        const movies = tMovies.data.results;
        const picks = movies.filter((m) => m.backdrop_path && m.overview);
        const heroItem = picks[Math.floor(Math.random() * Math.min(picks.length, 6))];

        setTrendingMovies(movies);
        setTrendingTv(tTv.data.results);
        setTopMovies(trMovies.data.results);
        setTopTv(trTv.data.results);

        // Fetch hero item trailer
        if (heroItem) {
          setFeatured({ ...heroItem, media_type: 'movie' });
          setHeroLoading(false);
          try {
            const vRes = await getMovieVideos(heroItem.id);
            const yt = vRes.data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
            if (yt) setTrailerKey(yt.key);
          } catch {
            // no trailer
          }
        } else {
          setHeroLoading(false);
        }
      } catch (err) {
        console.error('HomePage fetch error:', err);
        setHeroLoading(false);
      } finally {
        setRowsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="homepage">
      <HeroSection item={featured} trailerKey={trailerKey} loading={heroLoading} />

      <div className="homepage__rows">
        <MediaRow
          title="Trending Movies"
          items={trendingMovies}
          loading={rowsLoading}
          seeAllLink="/movies"
          mediaType="movie"
        />
        <MediaRow
          title="Trending TV Shows"
          items={trendingTv}
          loading={rowsLoading}
          seeAllLink="/tvshows"
          mediaType="tv"
        />
        <MediaRow
          title="Top Rated Movies"
          items={topMovies}
          loading={rowsLoading}
          seeAllLink="/movies"
          mediaType="movie"
        />
        <MediaRow
          title="Top Rated TV Shows"
          items={topTv}
          loading={rowsLoading}
          seeAllLink="/tvshows"
          mediaType="tv"
        />
      </div>
    </div>
  );
};

export default HomePage;
