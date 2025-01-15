import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  CircularProgress 
} from '@mui/material';
import { getMovieDetails } from '../services/api';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieDetails(id);
        setMovie(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Typography variant="h5">Film non trouvé</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {new Date(movie.release_date).toLocaleDateString()}
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Note moyenne : {movie.vote_average}/10
            </Typography>
            <Typography variant="subtitle1">
              Durée : {movie.runtime} minutes
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MovieDetails; 