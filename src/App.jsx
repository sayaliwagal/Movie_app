import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails'; //Ensure this path is correct
import Register from './components/Register';
import KeepAlive from './pages/KeepAlive';

const App = () => {
  return (
    <Router>
      <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path='/register' element={<Register />} />
           <Route path="/movie/:movieId" element={<MovieDetails />} />
           <Route path="/keep-alive" element={<KeepAlive />} />
      </Routes>
    </Router>
  )
}

export default App;