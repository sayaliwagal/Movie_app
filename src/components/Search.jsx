import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, fetchMovieTitleSuggestions } from '../tmdbService';

const Search = ({ onSearch })  => {
  const [query, setQuery] = useState('');
  const[suggestions, setSuggestions] = useState([]);
  const[showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(query.length >= 3){
      const fetchSuggestions = async () => {
        const data = await fetchMovieTitleSuggestions(query); // Use fetchMovies for suggestions
        if(data && data.length > 0){

          setSuggestions(data.slice(0,5)); // Display top 5 suggestions
          setShowSuggestions(true);
        }else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      };

      const delayDebounceFn = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }else{
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.title);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(movie.title); //Notify HomePage to perform the debounced search 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(query.trim()){
      onSearch(query); // Notify HomePage to perform the debounced search
    }
  };
  
  return (
    <div className='search relative'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center'>
           <img src="./search.svg" alt="search" className='mr-4'/>
            <input 
            id='search' 
            type='text' 
            placeholder='Search your Favorite Movie here ...'
            className='bg-gray-700 text-white rounded-full ml-8 py-2 px-4 w-full focus:outline-none'
            value={query} 
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(query.length >= 3)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}/>
            <button type='submit' className="ml-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2 focus:outline-none">
              {/* You can add a search icon here  */}
              Search
            </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 mt-2 w-full bg-gray-800 text-white rounded-md shadow-lg z-10">
            {suggestions.map((movie) => (
              <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer"
              key={movie.id} // Use the title as the key for now
              onClick={() => handleSuggestionClick(movie)}>
                {movie.title}
              </li>
            ))}
          </ul>
        )}
      </form>

    </div>
  );

};

export default Search;
