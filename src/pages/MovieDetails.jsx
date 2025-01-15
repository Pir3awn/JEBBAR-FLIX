import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  CircularProgress,
  Chip,
  Rating
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
        <CircularProgress sx={{ color: 'var(--secondary-color)' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Typography variant="h5" className="section-title">Film non trouvé</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ 
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          background: `linear-gradient(to bottom, rgba(3, 37, 65, 0.8), rgba(3, 37, 65, 0.4)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
          zIndex: -1,
          borderRadius: '30px'
        }
      }}>
        <Grid container spacing={4} sx={{ pt: 4, pb: 8, px: 4 }}>
          <Grid item xs={12} md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ 
                width: '100%', 
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{ 
                color: 'white',
                fontFamily: 'var(--heading-font)',
                fontWeight: 800,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {movie.title}
            </Typography>
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {movie.genres?.map(genre => (
                <Chip 
                  key={genre.id} 
                  label={genre.name}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontFamily: 'var(--body-font)'
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Rating 
                value={movie.vote_average / 2} 
                precision={0.5} 
                readOnly
                sx={{ color: 'var(--secondary-color)' }}
              />
              <Typography 
                sx={{ 
                  color: 'white',
                  fontFamily: 'var(--body-font)',
                  fontWeight: 500
                }}
              >
                {movie.vote_average.toFixed(1)}/10
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: -4, 
          borderRadius: '20px',
          background: 'white',
          position: 'relative'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontFamily: 'var(--heading-font)',
            fontWeight: 700,
            color: 'var(--primary-color)',
            mb: 3
          }}
        >
          Synopsis
        </Typography>
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            fontFamily: 'var(--body-font)',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            mb: 4
          }}
        >
          {movie.overview}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Date de sortie
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {new Date(movie.release_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Durée
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {movie.runtime} minutes
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Budget
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {movie.budget.toLocaleString('fr-FR')} $
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default MovieDetails; 