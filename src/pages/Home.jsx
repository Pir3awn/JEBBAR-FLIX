import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { getPopularMovies } from '../services/api';

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getPopularMovies();
        setMovies(response.data.results);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Films Populaires
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card component={Link} to={`/film/${movie.id}`} sx={{ textDecoration: 'none' }}>
              <CardMedia
                component="img"
                height="400"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home; 