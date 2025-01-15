import axios from 'axios';

const API_KEY = '847fce8e9daaa6f040e39b231f788f54';
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
  return api.get(`/movie/${movieId}`);
}; 