import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails'; //Ensure this path is correct

const App = () => {
  return (
    <Router>
      <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/movie/:movieId" element={<MovieDetails />} />
      </Routes>
    </Router>
  )
}

export default App;