import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr-FR',
  },
});

export const getPopularMovies = () => {
  return api.get('/movie/popular');
};

export const searchMovies = (query) => {
  return api.get('/search/movie', {
    params: {
      query,
    },
  });
};

export const getMovieDetails = (movieId) => {
  return axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);
};

export const getMovieVideos = (movieId) => {
  return axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`);
};

export const getSimilarMovies = (movieId) => {
  return axios.get(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=fr-FR&page=1`);
};

export const getMoviesByGenre = (genreId) => {
  return api.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    }
  });
};