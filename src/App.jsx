import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import AddMovie from './pages/AddMovie';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/film/:id" element={<MovieDetails />} />
        <Route path="/ajouter" element={<AddMovie />} />
      </Routes>
    </>
  );
}

export default App;
