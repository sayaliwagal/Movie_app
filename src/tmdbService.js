const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; //For displaying poster images

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`,
    },
};
const movieCache = new Map();

async function fetchMovieDetails(movieId) {
    // Check cache first
    if (movieCache.has(movieId)) {
        return movieCache.get(movieId);
    }
    
    // IMPORTANT FIX: Make sure we're using the correct parameter name "videos" (plural)
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,genres,videos,images,recommendations,similar,keywords`;

    try {
        const response = await fetch(url, API_OPTIONS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Store in cache
        movieCache.set(movieId, data);
        return data;
    } catch (error) {
        console.error('Error fetching movie details: ', error);
        return null;
    }
}

async function fetchMovieWatchProviders(movieId){
    const url = `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`;
    try {
        const response = await fetch(url, API_OPTIONS);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || {}; //Return an object with countries as keys
    }catch(e) {
        console.error('Error fetching movie watch providers :', e);
        return {};
    }
}

export const fetchMovies = async (query = '', selectedGenres = [], selectedYears = [], selectedRatings = [], sortBy = 'popularity.desc') => {
    try {
        let endpoint = query
            ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&sort_by=${sortBy}` 
            : `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}`;

        const queryParams = [];
        if (selectedGenres.length > 0) {
            queryParams.push(`with_genres=${selectedGenres.join(',')}`);
        }
        //Add year filter to api call 
        if(selectedYears.length > 0){
            //If only year is selected, use primary_release_year
            if(selectedYears.length === 1){
                queryParams.push(`primary_release_year=${selectedYears[0]}`);
            }else {
                //For multiple years, we'll still need to filter client-side
                // But we can optimize by setting a range if years are consecutive
                const years = selectedYears.map(Number).sort((a,b) => a - b);
                queryParams.push(`primary_release_date.gte=${years[0]}-01-01`);
                queryParams.push(`primary_release_date.lte=${years[years.length - 1]-12-31}`);
                
            }
        }

        // Add rating filter
        if (selectedRatings.length > 0) {
            const minRating = Math.min(...selectedRatings.map(Number));
            queryParams.push(`vote_average.gte=${minRating}`);
        }
        //Add all query parameters to endpoint
        if (queryParams.length > 0) {
            endpoint += `&${queryParams.join('&')}`;
        }
        console.log('Fetching movie with URL:', endpoint);
        
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        let filteredMovies = data.results || [];

        // Additional client-side filtering for years if multiple years are selected
        if (selectedYears.length > 1) {
            filteredMovies = filteredMovies.filter(movie => {
                if (!movie.release_date) return false;
                const movieYear = String(new Date(movie.release_date).getFullYear());
                return selectedYears.includes(movieYear);
        });
        }
        if (selectedRatings.length > 0) {
            filteredMovies = filteredMovies.filter(movie =>
                selectedRatings.some(rating => movie.vote_average >= parseFloat(rating))
            );
        }

        return filteredMovies;
    } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        return [];
    }
};

async function fetchMovieRecommendations(movieId) {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US`;
  
    try {
      const response = await fetch(url, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      return [];
    }
  }

export { fetchMovieDetails, fetchMovieRecommendations, fetchMovieWatchProviders, IMAGE_BASE_URL };