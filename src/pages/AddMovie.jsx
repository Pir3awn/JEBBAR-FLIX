import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper
} from '@mui/material';

function AddMovie() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    releaseDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nouveau film ajouté:', formData);
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 6, backgroundColor: '#141414' }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
          Ajouter un nouveau film
        </Typography>

        <Paper sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}>
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
                label="Description"
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

              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: '#e50914', '&:hover': { bgcolor: '#b2070f' } }}
              >
                Ajouter le film
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.5)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
  }
};

export default AddMovie; 