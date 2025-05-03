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

export const fetchMovies = async (query = '', selectedGenres = [], selectedYears = [], selectedRatings = [], sortBy = 'popularity.desc') => {
    try {
        let endpoint = query
            ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&sort_by=${sortBy}` 
            : `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}`;

        const queryParams = [];
        if (selectedGenres.length > 0) {
            queryParams.push(`with_genres=${selectedGenres.join(',')}`);
        }
        if (queryParams.length > 0) {
            endpoint += `&${queryParams.join('&')}`;
        }
        
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        let filteredMovies = data.results || [];

        if (selectedYears.length > 0) {
            filteredMovies = filteredMovies.filter(movie =>
                movie.release_date && selectedYears.includes(String(new Date(movie.release_date).getFullYear()))
            );
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

// async function fetchMovieRecommendation(movieId){
//     const url = `<span class="math-inline">\{TMDB\_BASE\_URL\}/movie/</span>{movieId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US`;

//     try{
//         const response = await fetch(url, API_OPTIONS);
//         if(!response.ok){
//             throw new Error(`HTTP error! status: ${response.status}`);

//         }
//         const data = await response.json();
//         return data.results || [];
//     } catch(e){
//         console.error('Error fetching movie recommendation:', error);
//      return [];
//     }
  
// }
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

export { fetchMovieDetails, fetchMovieRecommendations, IMAGE_BASE_URL };