import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Typography,
  Container,
  InputBase,
  IconButton,
  CircularProgress,
  Grid,
  Fade
} from '@mui/material';
import { Link } from 'react-router-dom';
import { searchMovies } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const NoOutlineInput = styled('input')({
  flex: 1,
  width: '100%',
  background: 'none',
  border: 'none',
  color: 'white',
  padding: '16px 24px',
  fontSize: '1.2rem',
  outline: 'none',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
  },
  '&::-moz-focus-inner': {
    border: 0,
  },
  '&:-moz-focusring': {
    outline: 'none',
  },
  '&::-webkit-focus-ring-color': {
    outline: 'none',
  }
});

function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
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
        setSuggestions(response.data.results.slice(0, 3));
      } catch (error) {
        console.error('Erreur suggestions:', error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

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

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#141414',
      pt: { xs: 8, md: 12 }
    }}>
      {/* Search Header */}
      <Container maxWidth="xl">
        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            position: 'relative',
            maxWidth: '800px',
            mx: 'auto',
            mb: 6,
            border: '2px solid #e50914',
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0.75)'
          }}
        >
          <Box sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}>
            <NoOutlineInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Rechercher un film..."
            />
            <IconButton 
              type="submit"
              sx={{ 
                color: 'white',
                mr: 1
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Box sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              backgroundColor: '#141414',
              borderRadius: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 10,
              overflow: 'hidden'
            }}>
              {suggestions.map((movie) => (
                <Box
                  key={movie.id}
                  component={Link}
                  to={`/film/${movie.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
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
                      borderRadius: 1,
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

        {/* Search Results */}
        {query && (
          <Box sx={{ pb: 6 }}>
            {loading ? (
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh'
              }}>
                <CircularProgress sx={{ color: '#e50914', mb: 2 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Recherche en cours...
                </Typography>
              </Box>
            ) : searchResults.length > 0 ? (
              <Fade in timeout={500}>
                <Box>
                  <Typography sx={{ 
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    mb: 4
                  }}>
                    {searchResults.length} résultats pour "{query}"
                  </Typography>

                  <Grid container spacing={2}>
                    {searchResults.map((movie) => (
                      <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                        <Box
                          component={Link}
                          to={`/film/${movie.id}`}
                          sx={{
                            position: 'relative',
                            display: 'block',
                            width: '100%',
                            paddingTop: '150%',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              zIndex: 2,
                              '& .movie-info': { opacity: 1 }
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
                            className="movie-info"
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              p: 2,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.95))',
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          >
                            <Typography sx={{ 
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              mb: 1
                            }}>
                              {movie.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ 
                                color: '#46d369',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}>
                                {Math.round(movie.vote_average * 10)}% Match
                              </Typography>
                              <Typography sx={{ 
                                color: '#777',
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
                </Box>
              </Fade>
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
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Search; 