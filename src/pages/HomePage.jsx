import React, { useState, useEffect } from 'react';
import Search from '../components/Search.jsx';
import { Spinner } from "flowbite-react";
import MovieCard from '../components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingmovies, updateSearchCount } from '../appwrite.js';
import GenresFilter from '../components/GenresFilter.jsx';
import YearFilter from '../components/YearFilter.jsx';
import RatingFilter from '../components/RatingFilter.jsx';
import SortingOptions from '../components/SortingOptions.jsx';
import { BrowserRouter as Router, Routes,Route, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchMovies } from '../tmdbService.js';

const HomePage = () => {
    const [search, setSearch] =useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTranding, setIsLoadingTranding] = useState(false);
    const [errorMesage, setErrorMessage] = useState('');
    const [errorTrandingMessage, setErrorTrandingMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState(''); 
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);  // State for selected genres
    const [selectedYears, setSelectedYears] = useState([]); //State for selected years.
    const [selectedRatings, setSelectedRatings] = useState([]); //State for selected ratings.
    const [sortBy, setSortBy] = useState('popularity.desc'); // State for sorting options
    const [currentSortLable, setCurrentSortLable] = useState('Popularity (Descending)'); //State for sortLable to display 
    
    const sortOptionLables ={
      'popularity.desc'    : 'Popularity (Descending)',
      'release_date.desc'  : 'Release Date (Newest First)',
      'vote_average.desc'  : 'User Rating (Highest First)',
      'original_title.asc' : 'Title (A-Z)', 
    };
    
    useDebounce(() => setDebouncedSearch(search), 500,  [search] )
    useEffect(() => {
      const loadMovies = async () => {
        setIsLoading(true);
        setErrorMessage('');
        const movies = await fetchMovies(debouncedSearch,selectedGenres,selectedYears,selectedRatings, sortBy);
        setMovieList(movies);
        setIsLoading(false);
        if(debouncedSearch && movies.length > 0){
          await updateSearchCount(debouncedSearch, movies[0]);
        }
    };
  loadMovies(); }, [debouncedSearch, selectedGenres, selectedYears, selectedRatings, sortBy]);

   
    const loadTrendingMovies = async () => {
      setIsLoadingTranding(true);
      setErrorTrandingMessage('');

      try {
        const movies = await getTrendingmovies();
        setTrendingMovies(movies);
      } catch(error){
        console.error(`Error fetching TrendingMovies movies: ${error}`);
        setErrorTrandingMessage('Error fetching TrendingMovies movies. Please try again later')
      }finally {
        setIsLoadingTranding(false);
      }
    };

    const handleGenreSelection = (genres) => {
      setSelectedGenres(genres);
    };

    const handleYearSelection = (years) => {
      setSelectedYears(years);
    };

    const handleRatingSelection = (ratings) => {
      setSelectedRatings(ratings);
    };

    const handleSortChange = (newSortBy) => {
      setSortBy(newSortBy);
      setCurrentSortLable(sortOptionLables[newSortBy] || 'Sort By ') //Update the label
    };

  
    useEffect(() => {
      loadTrendingMovies();
    }, []);
  return (
    <main className='box-box-border p-16 m-0 overflow-x-hidden'>
       <div className='pattern'></div>
       <div className='wrapper'>
        <header>
          <img src="./mVLozhndkLrweZg4wYPKsb-1200-80.jpg" alt="" />
          <h1>Find <span className='text-gradient'>Movie</span> You'll Enjoy witout the Hassle</h1>
          <Search search={search} setSearch = {setSearch} />
        </header>

        <div className="filters flex flex-col md:flex-row gap-4 mt-8 mb-8 justify-center">
          <img className='w-8' src='./filter.svg' alt='Filter'/>
           <GenresFilter onGenreChange={handleGenreSelection} selectedGenres={selectedGenres} />
           <YearFilter onYearChange={handleYearSelection} selectedYears={selectedYears} />
           <RatingFilter onRatingChange={handleRatingSelection} selectedRatings={selectedRatings} />
           <SortingOptions onSortChange={handleSortChange} currentSortOption={sortBy}/>  {/* Render SortingOptions */}
        {/* Display the applied sorting option */}
   {currentSortLable !== 'Sort By' && (
    <div className="applied-filters">
      <span className="inline-flex item-center rounded-md-yellow-100 px-2 py-1 text-md font-medium text-gray-100">
        :- Sorted by : {currentSortLable}
      </span>
    </div>
   )}
       
        </div>
  

        {trendingMovies.length > 0 &&  isLoadingTranding ? ( <div className='text-center'><Spinner color="warning"  size="md" /></div>) :
      errorTrandingMessage ? (<p className='text-red-500'>{errorTrandingMessage}</p>):(
        <section className="trending mb-32">
        <h2>Trending Movies</h2>
        <ul>
          {trendingMovies.map((movie, index) => (
            <li key = {movie.$id}>
              <p className='mr-2'>{index + 1}</p>
              {/* <img src={movie.poster_url} alt= {movie.title} /> */}
              <img src={movie.poster_url ? movie.poster_url : '/No-Poster.svg'} alt={movie.title} />  
                 
            </li>
              ))}

        </ul>
      </section>
      )}
       
        <section className='all-movies'>
          <h2>All Movies</h2>
      {isLoading ? ( <div className='text-center'><Spinner color="warning"  size="md" /></div>) :
      errorMesage ? (<p className='text-red-500'>{errorMesage}</p>
      ): ( <ul>
      
        {movieList.map((movie) => (
          <li  key={movie.id}>
              <MovieCard key={movie.id} movie ={movie} />
                {/* Add a Link to the MovieDetails page */}
                  <Link to={`/movie/${movie.id}`}>View Details</Link>
          </li>
        ))}

    
          </ul>) }
        </section>
       </div>
    </main>
 
  );
}

export default HomePage
