import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { getPopularMovies, getMoviesByGenre } from '../services/api';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comédie" },
  { id: 27, name: "Horreur" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" }
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      try {
        const popularResponse = await getPopularMovies();
        const popularMovies = popularResponse.data.results;
        setMovies(popularMovies);
        // Set a random popular movie as featured
        setFeaturedMovie(popularMovies[Math.floor(Math.random() * popularMovies.length)]);

        const genrePromises = GENRES.map(genre => 
          getMoviesByGenre(genre.id)
            .then(response => ({
              id: genre.id,
              name: genre.name,
              movies: response.data.results
            }))
        );

        const genreResults = await Promise.all(genrePromises);
        const genreMoviesMap = {};
        genreResults.forEach(result => {
          genreMoviesMap[result.id] = {
            name: result.name,
            movies: result.movies
          };
        });
        setGenreMovies(genreMoviesMap);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  if (!featuredMovie) {
    return (
      <Box 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#141414'
        }}
      />
    );
  }

  return (
    <Box sx={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        height: '95vh',
        width: '100%',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(0deg, #141414 0%, transparent 50%, rgba(20,20,20,0.4) 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Box
          component="img"
          src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
          alt={featuredMovie.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%'
          }}
        />
        
        <Box sx={{
          position: 'absolute',
          bottom: '25%',
          left: { xs: '4%', md: '60px' },
          maxWidth: '600px',
          zIndex: 2
        }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              mb: 2,
              lineHeight: 1.1
            }}
          >
            {featuredMovie.title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'white',
              mb: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {featuredMovie.overview}
          </Typography>
        </Box>
      </Box>

      {/* Movie Rows */}
      <Container 
        maxWidth={false} 
        sx={{ 
          mt: '-20vh',
          position: 'relative',
          zIndex: 3,
          px: { xs: 1, sm: 2, md: 4 }
        }}
      >
        <MovieRow title="Films Populaires" movies={movies} />
        
        {Object.entries(genreMovies).map(([genreId, data]) => (
          <MovieRow
            key={genreId}
            title={data.name}
            movies={data.movies}
          />
        ))}
      </Container>
    </Box>
  );
}

function MovieRow({ title, movies }) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    bgcolor: 'rgba(0,0,0,0.7)',
    color: 'white',
    '&:hover': { 
      bgcolor: 'rgba(0,0,0,0.9)',
      transform: 'translateY(-50%) scale(1.1)'
    },
    transition: 'all 0.2s ease'
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const currentRow = rowRef.current;
    if (currentRow) {
      currentRow.addEventListener('scroll', handleScroll);
      return () => currentRow.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -rowRef.current.clientWidth : rowRef.current.clientWidth;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ mb: 6, position: 'relative' }}>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          mb: 2,
          fontWeight: 500,
          pl: 2,
          fontSize: { xs: '1.25rem', md: '1.5rem' }
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {showLeftArrow && (
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              ...arrowButtonStyle,
              left: -5
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
        )}

        <Box
          ref={rowRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': { display: 'none' },
            gap: 1,
            px: 2,
            py: 4
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Box>

        {showRightArrow && (
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              ...arrowButtonStyle,
              right: -5
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

function MovieCard({ movie }) {
  const movieInfoStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 40%)',
    p: 1.5,
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'all 0.3s ease'
  };

  const movieTitleStyle = {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 600,
    mb: 0.5,
    lineHeight: 1.2
  };

  return (
    <Box
      component={Link}
      to={`/film/${movie.id}`}
      sx={{
        position: 'relative',
        flexShrink: 0,
        width: { xs: '150px', sm: '200px', md: '240px' },
        aspectRatio: '2/3',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        '&:hover': {
          transform: 'scale(1.2)',
          zIndex: 5,
          '& .movie-info': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <Box
        component="img"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      <Box
        className="movie-info"
        sx={movieInfoStyle}
      >
        <Typography sx={movieTitleStyle}>
          {movie.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#46d369', fontSize: '0.8rem', fontWeight: 600 }}>
            {Math.round(movie.vote_average * 10)}% Match
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: '0.8rem' }}>
            {movie.release_date?.split('-')[0]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Home; 