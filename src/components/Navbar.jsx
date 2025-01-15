import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'var(--gradient)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: { xs: '1rem 0' }
        }}>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                color: 'var(--secondary-color)'
              }
            }}
          >
            🎬 JebbarFLIX
          </Typography>
          
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Button 
              component={Link} 
              to="/" 
              startIcon={<HomeIcon />}
              sx={{ 
                color: 'white',
                backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              Accueil
            </Button>
            <Button 
              component={Link} 
              to="/recherche"
              startIcon={<SearchIcon />}
              sx={{ 
                color: 'white',
                backgroundColor: isActive('/recherche') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              Recherche
            </Button>
            <Button 
              component={Link} 
              to="/ajouter"
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ 
                backgroundColor: isActive('/ajouter') ? '#0099c9' : 'var(--secondary-color)',
                '&:hover': {
                  backgroundColor: '#0099c9'
                }
              }}
            >
              Ajouter
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 