import { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography,
  Container,
  Autocomplete,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { searchMovies } from '../services/api';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fonction pour rechercher les suggestions
  useEffect(() => {
    const searchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await searchMovies(query);
        setSuggestions(response.data.results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce la recherche pour éviter trop d'appels API
    const timeoutId = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await searchMovies(query);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'var(--primary-color)',
          textAlign: 'center',
          mb: 4
        }}
      >
        Rechercher un film
      </Typography>
      
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) => 
                  typeof option === 'string' ? option : option.title
                }
                loading={loading}
                value={selectedMovie}
                onChange={(event, newValue) => {
                  setSelectedMovie(newValue);
                  if (newValue) {
                    setQuery(newValue.title);
                    setMovies([newValue]);
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setQuery(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Nom du film"
                    variant="outlined"
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'var(--secondary-color)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--secondary-color)',
                        },
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box 
                    component="li" 
                    {...props}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(1,180,228,0.1)',
                      },
                      padding: '12px !important'
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        {option.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${option.poster_path}`}
                            alt={option.title}
                            style={{ 
                              width: '50px', 
                              height: '75px', 
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '50px',
                              height: '75px',
                              bgcolor: 'grey.300',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            No Image
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {option.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.release_date && new Date(option.release_date).getFullYear()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained"
                onClick={handleSearch}
                sx={{ 
                  height: '56px',
                  backgroundColor: 'var(--secondary-color)',
                  '&:hover': {
                    backgroundColor: '#0099c9'
                  },
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                Rechercher
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card 
              component={Link} 
              to={`/film/${movie.id}`} 
              sx={{ 
                textDecoration: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}
                >
                  {movie.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--text-secondary)' }}
                >
                  {movie.release_date && new Date(movie.release_date).getFullYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Search; 