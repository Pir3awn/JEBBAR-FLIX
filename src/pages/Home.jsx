import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Container, Box } from '@mui/material';
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
    <Container maxWidth="xl">
      <Box sx={{ 
        background: 'var(--gradient)',
        padding: '60px 20px',
        borderRadius: '0 0 30px 30px',
        marginBottom: 6,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/movie-pattern.png) repeat',
          opacity: 0.1,
        }
      }}>
        <Typography 
          variant="h2" 
          gutterBottom
          sx={{ 
            fontFamily: 'var(--heading-font)',
            color: 'white',
            fontWeight: 800,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '-0.5px'
          }}
        >
          Films Populaires
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'var(--body-font)',
            fontWeight: 400
          }}
        >
          Découvrez les films les plus populaires du moment
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card 
              component={Link} 
              to={`/film/${movie.id}`} 
              className="movie-card"
              sx={{ textDecoration: 'none' }}
            >
              <div className="movie-poster">
                <CardMedia
                  component="img"
                  height="400"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-info-overlay">
                  <Typography variant="body2" sx={{ 
                    color: 'white', 
                    mb: 1,
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    fontFamily: 'var(--body-font)'
                  }}>
                    {movie.overview.slice(0, 100)}...
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#01b4e4',
                    fontWeight: 500,
                    fontFamily: 'var(--body-font)'
                  }}>
                    ★ {movie.vote_average.toFixed(1)}/10
                  </Typography>
                </div>
              </div>
              <CardContent sx={{ padding: '16px' }}>
                <Typography className="movie-title">
                  {movie.title}
                </Typography>
                <Typography className="movie-year">
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 