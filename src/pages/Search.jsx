import { useState, useEffect } from 'react';
import { 
  TextField, 
  Typography,
  Container,
  Box,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Full search results
  const [suggestions, setSuggestions] = useState([]); // Quick suggestions
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle suggestions while typing
  useEffect(() => {
    const getSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await searchMovies(query);
        // Changed from 6 to 3 suggestions
        setSuggestions(response.data.results.slice(0, 3));
      } catch (error) {
        console.error('Erreur suggestions:', error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle full search (on enter/submit)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await searchMovies(query);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (movieId) => {
    setShowSuggestions(false);
    navigate(`/film/${movieId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'var(--gradient)',
        padding: '40px 20px',
        borderRadius: '30px',
        marginBottom: 6,
        textAlign: 'center',
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/movie-pattern.png) repeat',
          opacity: 0.1,
          borderRadius: '30px',
        }
      }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontFamily: 'var(--heading-font)',
            color: 'white',
            fontWeight: 800,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 3
          }}
        >
          Rechercher un film
        </Typography>

        {/* Search Form */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1100 }}>
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ position: 'relative' }}
          >
            <TextField
              fullWidth
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Entrez le nom d'un film..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'var(--secondary-color)' }}/>
                  </InputAdornment>
                ),
                endAdornment: loading && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--secondary-color)',
                    }
                  }
                }
              }}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  zIndex: 1200,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'var(--secondary-color)',
                    borderRadius: '4px',
                  }
                }}
              >
                <List sx={{ 
                  py: 0,
                  position: 'relative',
                }}>
                  {suggestions.map((movie) => (
                    <ListItem
                      key={movie.id}
                      button
                      onClick={() => handleSuggestionClick(movie.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(1,180,228,0.1)',
                        },
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={movie.poster_path 
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                            : 'https://via.placeholder.com/92x138?text=No+Image'
                          }
                          sx={{ width: 40, height: 60 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontFamily: 'var(--heading-font)', fontWeight: 600 }}>
                            {movie.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                            {movie.release_date && new Date(movie.release_date).getFullYear()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontFamily: 'var(--heading-font)',
              fontWeight: 700,
              mb: 3
            }}
          >
            Résultats de recherche
          </Typography>
          <Grid container spacing={3}>
            {searchResults.map((movie) => (
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
                      image={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={movie.title}
                    />
                    <div className="movie-info-overlay">
                      <Typography variant="body2" sx={{ 
                        color: 'white', 
                        mb: 1,
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}>
                        {movie.overview?.slice(0, 100) || 'Aucune description disponible'}...
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#01b4e4' }}>
                        ★ {(movie.vote_average || 0).toFixed(1)}/10
                      </Typography>
                    </div>
                  </div>
                  <CardContent>
                    <Typography className="movie-title">
                      {movie.title}
                    </Typography>
                    <Typography className="movie-year">
                      {movie.release_date 
                        ? new Date(movie.release_date).getFullYear()
                        : 'Date inconnue'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Results Message */}
      {!loading && searchResults.length === 0 && query && (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 8,
            px: 2
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontFamily: 'var(--heading-font)',
              color: 'var(--text-secondary)',
              mb: 2
            }}
          >
            Aucun résultat trouvé
          </Typography>
          <Typography 
            sx={{ 
              color: 'var(--text-secondary)',
              fontFamily: 'var(--body-font)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Nous n'avons trouvé aucun film correspondant à "{query}". 
            Essayez avec un autre terme de recherche.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Search; 