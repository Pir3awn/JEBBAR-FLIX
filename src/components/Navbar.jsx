import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'var(--primary-color)' }}>
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
              '&:hover': {
                color: 'var(--secondary-color)'
              }
            }}
          >
            MovieDB
          </Typography>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button 
              component={Link} 
              to="/" 
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Accueil
            </Button>
            <Button 
              component={Link} 
              to="/recherche"
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Recherche
            </Button>
            <Button 
              component={Link} 
              to="/ajouter"
              variant="contained"
              sx={{ 
                backgroundColor: 'var(--secondary-color)',
                '&:hover': {
                  backgroundColor: '#0099c9'
                }
              }}
            >
              Ajouter un film
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 