import { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddMovie() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    releaseDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pourriez ajouter la logique pour sauvegarder le film
    // Dans une vraie application, cela pourrait être dans une base de données
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Ajouter un nouveau film
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          required
          label="Titre"
          name="title"
          value={movie.title}
          onChange={handleChange}
          margin="normal"
        />
        
        <TextField
          fullWidth
          required
          multiline
          rows={4}
          label="Description"
          name="description"
          value={movie.description}
          onChange={handleChange}
          margin="normal"
        />
        
        <TextField
          fullWidth
          type="date"
          label="Date de sortie"
          name="releaseDate"
          value={movie.releaseDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Ajouter le film
        </Button>
      </Box>
    </Container>
  );
}

export default AddMovie; 