import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    releaseDate: '',
    posterUrl: '',
    backdropUrl: '',
    genres: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Here you would typically make an API call to save the movie
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'ajout du film.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      pt: 12, 
      pb: 6, 
      backgroundColor: '#141414'
    }}>
      <Container maxWidth="md">
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white',
            mb: 4,
            fontWeight: 600
          }}
        >
          Ajouter un nouveau film
        </Typography>

        <Paper 
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Film ajouté avec succès!
            </Alert>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                name="title"
                label="Titre du film"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                sx={textFieldStyle}
              />

              <TextField
                name="overview"
                label="Synopsis"
                value={formData.overview}
                onChange={handleChange}
                required
                multiline
                rows={4}
                fullWidth
                sx={textFieldStyle}
              />

              <TextField
                name="releaseDate"
                label="Date de sortie"
                type="date"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle}
              />

              <TextField
                name="posterUrl"
                label="URL de l'affiche"
                value={formData.posterUrl}
                onChange={handleChange}
                required
                fullWidth
                sx={textFieldStyle}
              />

              <TextField
                name="backdropUrl"
                label="URL de l'image de fond"
                value={formData.backdropUrl}
                onChange={handleChange}
                required
                fullWidth
                sx={textFieldStyle}
              />

              <TextField
                name="genres"
                label="Genres (séparés par des virgules)"
                value={formData.genres}
                onChange={handleChange}
                required
                fullWidth
                sx={textFieldStyle}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                sx={{
                  py: 1.5,
                  bgcolor: '#e50914',
                  '&:hover': {
                    bgcolor: '#b2070f'
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(229,9,20,0.5)'
                  }
                }}
              >
                {loading ? 'Ajout en cours...' : 'Ajouter le film'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

// Styles for text fields
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e50914',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
    '&.Mui-focused': {
      color: '#e50914',
    },
  },
  '& .MuiOutlinedInput-input': {
    '&::placeholder': {
      color: 'rgba(255,255,255,0.5)',
      opacity: 1,
    },
  },
};

export default AddMovie; 