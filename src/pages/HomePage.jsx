import React, { useState, useEffect, useCallback } from 'react';
import Search from '../components/Search.jsx';
import { Spinner } from "flowbite-react";
import MovieCardEnhanced from '../components/MovieCardEnhanced.jsx';
import { useDebounce } from 'react-use';
import { getTrendingmovies, updateSearchCount } from '../appwrite.js';
import GenresFilter from '../components/GenresFilter.jsx';
import YearFilter from '../components/YearFilter.jsx';
import RatingFilter from '../components/RatingFilter.jsx';
import SortingOptions from '../components/SortingOptions.jsx';
import PaginationComponent from '../components/Pagination.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import NoResults from '../components/NoResults.jsx';
import { BrowserRouter as Router, Routes,Route, Link } from 'react-router-dom';
import { fetchMovies } from '../tmdbService.js';

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
    const [lastSearchQuery, setLastSearchQuery] = useState('');
    const [didYouMeanSuggestion, setDidYouMeanSuggestion] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [totalPages, setTotalPages] = useState(1); // Total pages
    const [totalResults, setTotalResults] = useState(0); // Total results
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
        const result = await fetchMovies(debouncedSearch,selectedGenres,selectedYears,selectedRatings, sortBy, currentPage);
        setMovieList(result.movies);
        setTotalPages(result.totalPages);
        setTotalResults(result.totalResults);
        setIsLoading(false);
        setDidYouMeanSuggestion(''); // Clear previos suggestion
        if(debouncedSearch && result.movies.length === 0 && lastSearchQuery && lastSearchQuery.trim() != ""){
          //Try to find a 'Did You Mean?' Suggestion
          const allMovieTitles = trendingMovies.map(movie =>movie.title); //or fetch a border list
          const suggestion = findDidYouMean(lastSearchQuery, allMovieTitles);
          if(suggestion ){
            setDidYouMeanSuggestion(suggestion);
          }
        }
        if(debouncedSearch && result.movies.length > 0){
          await updateSearchCount(debouncedSearch, result.movies[0]);
        }
    };
  loadMovies(); }, [debouncedSearch, selectedGenres, selectedYears, selectedRatings, sortBy, currentPage]);

   const findDidYouMean = (query, titles) => {
    const bestMatch = matchRoutes.betMatch;
    if(bestMatch.rating > 0.6) {
      //Adjust the threshold as needed
      return bestMatch.target;
    }
    return null;
   };

   const handleDidYouMeanClick = (suggestion) => {
    setSearch(suggestion);
   };
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

    const handleGenreSelection = useCallback((genres) => {
      setSelectedGenres(genres);
      setCurrentPage(1); // Reset to page 1 when filters change
    },[]);

    const handleYearSelection = useCallback((years) => {
      setSelectedYears(years);
      setCurrentPage(1); // Reset to page 1 when filters change
      // console.log(years);
    }, []);

    const handleRatingSelection = useCallback((ratings) => {
      setSelectedRatings(ratings);
      setCurrentPage(1); // Reset to page 1 when filters change
    }, []);

    const handleSortChange = useCallback((newSortBy) => {
      setSortBy(newSortBy);
      setCurrentPage(1); // Reset to page 1 when sorting changes
      setCurrentSortLable(sortOptionLables[newSortBy] || 'Sort By ') //Update the label
      console.log(currentSortLable);
    }, []);

  
    useEffect(() => {
      loadTrendingMovies();
    }, []);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const handleResetFilters = () => {
      setSearch('');
      setSelectedGenres([]);
      setSelectedYears([]);
      setSelectedRatings([]);
      setSortBy('popularity.desc');
      setCurrentPage(1);
      setCurrentSortLable('Popularity (Descending)');
    };

  return (
    <main className='box-box-border p-16 m-0 overflow-x-hidden'>
       <div className='pattern'></div>
       <div className='wrapper'>
        <header>
          <img src="./mVLozhndkLrweZg4wYPKsb-1200-80.jpg" alt="" />
          <h1>Find <span className='text-gradient'>Movie</span> You'll Enjoy witout the Hassle</h1>
          <Search onSearch={setSearch}  setLastSearchQuery={setLastSearchQuery}/>
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
      :-  {currentSortLable}
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
          {totalResults > 0 && !isLoading && (
            <p className='results-counter'>
              Showing {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalResults)} of {totalResults} results
            </p>
          )}
      {isLoading ? ( 
        <SkeletonLoader count={8} />
      ) : errorMesage ? (
        <div className='text-red-500 text-center py-8'>{errorMesage}</div>
      ) : movieList.length === 0 ? (
        <NoResults 
          searchQuery={debouncedSearch}
          onReset={handleResetFilters}
        />
      ) : (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {movieList.map((movie) => (
            <li key={movie.id} className='h-full'>
              <MovieCardEnhanced movie={movie} />
            </li>
          ))}
        </ul>
      )}
        </section>

        {/* Pagination Component */}
        {totalPages > 1 && (
          <PaginationComponent 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange}
          />
        )}
       </div>
    </main>
 
  );
}

export default HomePage
