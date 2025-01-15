import { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Paper,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

function AddMovie() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    releaseDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Film ajouté:', movie);
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        background: 'var(--gradient)',
        padding: '40px 20px',
        borderRadius: '30px',
        marginBottom: 6,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/movie-pattern.png) repeat',
          opacity: 0.1,
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
          Ajouter un nouveau film
        </Typography>
      </Box>

      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: '20px',
            background: 'white',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Titre du film"
                  name="title"
                  value={movie.title}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
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
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={movie.description}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
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
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date de sortie"
                  name="releaseDate"
                  value={movie.releaseDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
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
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ 
                    mt: 2,
                    height: '56px',
                    background: 'var(--gradient)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: 'var(--body-font)',
                    '&:hover': {
                      background: 'var(--gradient)',
                      filter: 'brightness(110%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(1,180,228,0.3)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Ajouter le film
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Container>
  );
}

export default AddMovie; 