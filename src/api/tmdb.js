import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const IMG_BASE = 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

// Image URL helpers
export const getPosterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const getBackdropUrl = (path, size = 'original') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const getProfileUrl = (path, size = 'w185') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

// ——— Trending ———
export const getTrending = (type = 'all', timeWindow = 'day', page = 1) =>
  tmdb.get(`/trending/${type}/${timeWindow}`, { params: { page } });

// ——— Movies ———
export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`);

export const getMovieCredits = (id) =>
  tmdb.get(`/movie/${id}/credits`);

export const getMovieVideos = (id) =>
  tmdb.get(`/movie/${id}/videos`);

export const getSimilarMovies = (id, page = 1) =>
  tmdb.get(`/movie/${id}/similar`, { params: { page } });

export const getMoviesByGenre = (genreId, page = 1) =>
  tmdb.get('/discover/movie', {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
  });

export const getTopRatedMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } });

export const getPopularMovies = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } });

export const getNowPlayingMovies = (page = 1) =>
  tmdb.get('/movie/now_playing', { params: { page } });

// ——— TV Shows ———
export const getTvDetails = (id) =>
  tmdb.get(`/tv/${id}`);

export const getTvCredits = (id) =>
  tmdb.get(`/tv/${id}/credits`);

export const getTvVideos = (id) =>
  tmdb.get(`/tv/${id}/videos`);

export const getSimilarTv = (id, page = 1) =>
  tmdb.get(`/tv/${id}/similar`, { params: { page } });

export const getTvByGenre = (genreId, page = 1) =>
  tmdb.get('/discover/tv', {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
  });

export const getTopRatedTv = (page = 1) =>
  tmdb.get('/tv/top_rated', { params: { page } });

export const getPopularTv = (page = 1) =>
  tmdb.get('/tv/popular', { params: { page } });

// ——— Search ———
export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', { params: { query, page } });

export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page } });

export const searchTv = (query, page = 1) =>
  tmdb.get('/search/tv', { params: { query, page } });

// ——— Genres ———
export const getMovieGenres = () =>
  tmdb.get('/genre/movie/list');

export const getTvGenres = () =>
  tmdb.get('/genre/tv/list');

export default tmdb;
