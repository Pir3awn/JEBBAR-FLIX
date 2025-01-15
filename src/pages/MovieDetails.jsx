import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  IconButton,
  Chip,
  Fade,
  CircularProgress,
  Skeleton,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CloseIcon from '@mui/icons-material/Close';
import { getMovieDetails, getMovieVideos, getSimilarMovies } from '../services/api';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const commonTransition = {
    transition: 'all 0.3s ease'
  };

  const hoverScale = {
    '&:hover': {
      transform: 'scale(1.05)',
      bgcolor: 'rgba(0,0,0,0.7)'
    },
    ...commonTransition
  };

  const controlButton = {
    color: 'white',
    bgcolor: 'rgba(0,0,0,0.5)',
    ...hoverScale
  };

  const gradientOverlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const movieInfoBox = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    p: 2,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 40%)',
    opacity: 0,
    transform: 'translateY(10px)',
    ...commonTransition
  };

  const absoluteFill = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const movieImage = {
    ...absoluteFill,
    objectFit: 'cover'
  };

  const movieTitleStyle = {
    color: 'white',
    fontWeight: 700,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const metadataStyle = {
    color: 'white',
    fontSize: '0.9rem',
    mb: 1
  };

  const labelStyle = {
    color: '#777'
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieData, videosData, similarData] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getSimilarMovies(id)
        ]);

        setMovie(movieData.data);
        setVideos(videosData.data.results);
        setSimilarMovies(similarData.data.results);

        setTimeout(() => setShowVideo(true), 1000);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Box 
        className="loading-container"
      >
        <CircularProgress sx={{ color: '#e50914' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box 
        sx={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#141414',
          color: 'white',
          gap: 2
        }}
      >
        <Typography variant="h5">Film non trouvé</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{
            bgcolor: '#e50914',
            '&:hover': { bgcolor: '#b2070f' }
          }}
        >
          Retour à l'accueil
        </Button>
      </Box>
    );
  }

  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];

  return (
    <Box sx={{ 
      backgroundColor: '#141414', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Back Button */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000,
          ...controlButton
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          ...gradientOverlay,
          height: '70%',
          background: 'linear-gradient(180deg, transparent, rgba(20,20,20,0.8) 50%, #141414 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }
      }}>
        {showVideo && trailer ? (
          <Box 
            className="video-container"
            sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              backgroundColor: '#000',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  '& iframe': {
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }
                }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&loop=1&playlist=${trailer.key}&rel=0&iv_load_policy=3&fs=0&playsinline=1`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  onLoad={() => setIsVideoLoaded(true)}
                />
              </Box>
            </Box>

            {/* Video Controls Overlay */}
            <Box
              sx={{
                ...gradientOverlay,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 3,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              {/* Top Controls */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                p: 2
              }}>
                <IconButton
                  onClick={() => setShowVideo(false)}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { 
                      bgcolor: 'rgba(0,0,0,0.7)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Bottom Controls */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2
              }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    Bande annonce officielle
                  </Typography>
                  <Chip
                    label={movie.original_language.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: 1
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setMuted(!muted)}
                    sx={controlButton}
                  >
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </IconButton>
                  <IconButton
                    onClick={() => setShowVideo(false)}
                    sx={controlButton}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Fade in timeout={1000}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                sx={{
                  ...movieImage,
                  filter: 'brightness(0.7)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
              
              {/* Backdrop Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.7) 50%, rgba(20,20,20,0.4) 100%)',
                }}
              />
            </Box>
          </Fade>
        )}

        {/* Movie Info Overlay */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: { xs: 3, md: 6 },
            paddingBottom: { xs: 6, md: 8 },
            background: 'linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.8) 50%, transparent 100%)',
            zIndex: 2,
          }}
        >
          {loading ? (
            <Box sx={{ width: '50%' }}>
              <Skeleton variant="text" width="80%" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Box>
          ) : (
            <>
              <Typography 
                variant="h2" 
                className="movie-title"
                sx={{
                  ...movieTitleStyle,
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  mb: 3,
                  maxWidth: '800px',
                  animation: 'slideUp 0.8s ease'
                }}
              >
                {movie?.title}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap',
                mb: 3
              }}>
                <Typography sx={{ 
                  color: '#46d369',
                  fontWeight: 600
                }}>
                  {Math.round(movie.vote_average * 10)}% pertinent
                </Typography>
                <Typography sx={{ color: 'white' }}>
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
                <Typography sx={{ 
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  px: 1,
                  borderRadius: 1
                }}>
                  {movie.adult ? '18+' : 'Tout public'}
                </Typography>
                <Typography sx={{ color: 'white' }}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </Typography>
              </Box>

              <Typography sx={{ 
                color: 'white',
                maxWidth: '800px',
                fontSize: '1.1rem',
                lineHeight: 1.5,
                mb: 3
              }}>
                {movie.overview}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      }
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Additional Sections */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Additional Info - Moved to top */}
        <Box sx={{ color: 'rgba(255,255,255,0.7)', mb: 6 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            À propos de {movie.title}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ ...metadataStyle }}>
                <span style={labelStyle}>Réalisateur: </span>
                {movie?.credits?.crew?.find(person => person.job === 'Director')?.name || 'Non disponible'}
              </Typography>
              <Typography sx={{ ...metadataStyle }}>
                <span style={labelStyle}>Scénariste: </span>
                {movie?.credits?.crew?.find(person => person.job === 'Screenplay')?.name || 'Non disponible'}
              </Typography>
              <Typography sx={{ ...metadataStyle }}>
                <span style={labelStyle}>Distribution principale: </span>
                {movie?.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'Non disponible'}
              </Typography>
              <Typography sx={{ ...metadataStyle }}>
                <span style={labelStyle}>Genres: </span>
                {movie?.genres?.map(genre => genre.name).join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ ...metadataStyle }}>
                <span style={labelStyle}>Date de sortie: </span>
                {new Date(movie?.release_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Typography>
              <Typography sx={{ ...metadataStyle }}>
                <span style={labelStyle}>Langue originale: </span>
                {movie?.original_language?.toUpperCase()}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <Box sx={{ mt: 4, mb: 8 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                mb: 4,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <span>Titres similaires</span>
              <Chip 
                label={similarMovies.length}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              />
            </Typography>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)'
              },
              gap: 2.5
            }}>
              {similarMovies.slice(0, 10).map((movie) => (
                <Box
                  key={movie.id}
                  component={Link}
                  to={`/film/${movie.id}`}
                  sx={{
                    position: 'relative',
                    paddingTop: '150%',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    ...hoverScale
                  }}
                >
                  <Box
                    component="img"
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={movie.title}
                    sx={movieImage}
                  />
                  <Box
                    className="movie-info"
                    sx={movieInfoBox}
                  >
                    <Typography
                      sx={{
                        ...movieTitleStyle,
                        fontSize: '0.9rem',
                        mb: 0.5,
                        lineHeight: 1.2
                      }}
                    >
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
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default MovieDetails; 