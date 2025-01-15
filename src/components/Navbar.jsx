import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const buttonStyle = {
    textTransform: 'none',
    color: 'white',
    '&:hover': { color: 'rgba(255,255,255,0.7)' }
  };

  const mobileIconStyle = {
    color: 'white',
    display: { xs: 'flex', md: 'none' }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="fixed" 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      sx={{
        boxShadow: 'none',
        background: 'transparent',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              color: '#e50914',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.8rem',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            JEBBARFLIX
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 4 }}>
            <Button
              component={Link}
              to="/"
              sx={buttonStyle}
            >
              Accueil
            </Button>
            <Button
              component={Link}
              to="/search"
              sx={buttonStyle}
            >
              Rechercher
            </Button>
            <Button
              component={Link}
              to="/ajouter"
              sx={buttonStyle}
              startIcon={<AddIcon />}
            >
              Ajouter
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            component={Link}
            to="/search"
            sx={mobileIconStyle}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            component={Link}
            to="/ajouter"
            sx={mobileIconStyle}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 