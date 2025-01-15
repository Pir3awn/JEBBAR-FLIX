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
  IconButton,
  Button,
  MenuItem
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
  const [yearFilter, setYearFilter] = useState('all');

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

  // Add click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('form')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const filteredResults = searchResults.filter(movie => {
    if (yearFilter === 'all') return true;
    const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
    return movieYear === parseInt(yearFilter);
  });

  return (
    <Box sx={{ minHeight: '100vh', pt: 8, backgroundColor: '#141414' }}>
      {/* Search Hero Section */}
      <Container maxWidth="xl" sx={{ pt: 4, pb: 2 }}>
        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            position: 'relative',
            maxWidth: '800px',
            margin: '0 auto',
            zIndex: 1200
          }}
        >
          <TextField
            fullWidth
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Rechercher un film..."
            variant="standard"
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  mr: 2,
                  fontSize: '1.8rem'
                }}/>
              ),
              endAdornment: query && (
                <IconButton
                  onClick={() => {
                    setQuery('');
                    setSearchResults([]);
                    setShowSuggestions(false);
                  }}
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: '#fff' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ),
              sx: {
                color: 'white',
                fontSize: '2rem',
                '&:before': { borderBottom: '2px solid rgba(255,255,255,0.2)' },
                '&:after': { borderBottom: '2px solid #e50914' },
                '&:hover:not(.Mui-disabled):before': {
                  borderBottom: '2px solid rgba(255,255,255,0.3)'
                }
              }
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '16px 0',
                fontSize: '1.5rem',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.5)',
                  opacity: 1
                }
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />

          {/* Quick Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#141414',
                borderRadius: '4px',
                mt: 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                zIndex: 1300
              }}
            >
              {suggestions.map((movie) => (
                <Box
                  key={movie.id}
                  onClick={() => handleSuggestionClick(movie.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    },
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : 'https://via.placeholder.com/92x138?text=No+Image'
                    }
                    sx={{
                      width: '46px',
                      height: '69px',
                      borderRadius: '4px',
                      mr: 2,
                      objectFit: 'cover'
                    }}
                  />
                  <Box>
                    <Typography sx={{ 
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      {movie.title}
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem'
                    }}>
                      {movie.release_date?.split('-')[0]}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {/* Search Results */}
      {query && (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh'
            }}>
              <CircularProgress 
                sx={{ 
                  color: '#e50914',
                  mb: 2
                }}
              />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Recherche en cours...
              </Typography>
            </Box>
          ) : searchResults.length > 0 ? (
            <>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4
              }}>
                <Typography sx={{ 
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 500
                }}>
                  {filteredResults.length} résultats pour "{query}"
                </Typography>
                
                <TextField
                  select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  variant="standard"
                  sx={{
                    minWidth: 100,
                    '& .MuiInput-root': {
                      color: 'white',
                      '&:before': { borderBottom: '1px solid rgba(255,255,255,0.2)' },
                      '&:after': { borderBottom: '1px solid #e50914' },
                    },
                    '& .MuiSelect-icon': { color: 'white' }
                  }}
                >
                  <MenuItem value="all">Toutes les années</MenuItem>
                  {Array.from(new Set(searchResults
                    .map(movie => movie.release_date ? new Date(movie.release_date).getFullYear() : null)
                    .filter(year => year !== null)
                    .sort((a, b) => b - a)))
                    .map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))
                  }
                </TextField>
              </Box>

              <Grid container spacing={2}>
                {filteredResults.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                    <Box
                      component={Link}
                      to={`/film/${movie.id}`}
                      sx={{
                        position: 'relative',
                        display: 'block',
                        paddingTop: '150%',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          zIndex: 1,
                          '& .movie-info-overlay': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                        }
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Box
                        className="movie-info-overlay"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.9) 50%)',
                          p: 2,
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <Typography sx={{ 
                          color: 'white',
                          fontWeight: 500,
                          mb: 1,
                          fontSize: '0.9rem'
                        }}>
                          {movie.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ 
                            color: '#46d369',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}>
                            {Math.round(movie.vote_average * 10)}% Match
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.8rem'
                          }}>
                            {movie.release_date?.split('-')[0]}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center'
            }}>
              <Typography sx={{ 
                color: 'white',
                fontSize: '1.5rem',
                mb: 2,
                fontWeight: 500
              }}>
                Aucun résultat pour "{query}"
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px'
              }}>
                Essayez de modifier votre recherche ou explorez notre catalogue de films populaires.
              </Typography>
            </Box>
          )}
        </Container>
      )}
    </Box>
  );
}

export default Search; 