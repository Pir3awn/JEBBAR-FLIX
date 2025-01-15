import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from 'react';

function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="fixed" 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      elevation={0}
      sx={{
        background: isScrolled ? 'rgb(20, 20, 20)' : 'linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent)',
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
              sx={{
                color: 'white',
                '&:hover': { opacity: 0.7 },
                textTransform: 'none',
                fontSize: '0.9rem'
              }}
            >
              Accueil
            </Button>
            <Button
              component={Link}
              to="/search"
              sx={{
                color: 'white',
                '&:hover': { opacity: 0.7 },
                textTransform: 'none',
                fontSize: '0.9rem'
              }}
            >
              Rechercher
            </Button>
            <Button
              component={Link}
              to="/ajouter"
              sx={{
                color: 'white',
                '&:hover': { opacity: 0.7 },
                textTransform: 'none',
                fontSize: '0.9rem'
              }}
              startIcon={<AddIcon />}
            >
              Ajouter
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            component={Link}
            to="/search"
            sx={{
              color: 'white',
              display: { xs: 'flex', md: 'none' }
            }}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            component={Link}
            to="/ajouter"
            sx={{
              color: 'white',
              display: { xs: 'flex', md: 'none' }
            }}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 