import React, { useState, useEffect } from 'react'
import {Dropdown, DropdownItem} from "flowbite-react";

const GenresFilter = ({ onGenreChange, selectedGenres }) => {
    const [genres, setGenres] = useState([]);
    const API_BASE_URL = 'https://api.themoviedb.org/3';

    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    
    const API_OPTIONS = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    }
    useEffect(() => {
        const fetchGenres = async () => {
            let endpoint = `${API_BASE_URL}/genre/movie/list?language=en`;
            try {
                const response = await fetch(endpoint, API_OPTIONS);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error(`Error fetching genres: ${error}`);
            }
        };

        fetchGenres();
    }, [API_KEY]); // Added API_KEY as a dependency

    const handleGenreChange = (e) => {
        // Convert to numbers since TMDB genre IDs are numbers
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
        onGenreChange(selectedOptions);
    };

    return (
        <div className='mb-4'>
            {genres.length > 0 ? (
                 <Dropdown 
                 label={<span className="text-white font-semibold text-lg cursor-pointer">Genres </span>} inline multiple 
                 onChange={handleGenreChange} 
                 value={selectedGenres}   arrowIcon={false}>
                    
                    
                         {genres.map(genre =>(
                              <DropdownItem key={genre.id} value={genre.id}>
                                   {genre.name}
                             </DropdownItem>
                    ))}
         
                     
                     </Dropdown>
      
            ) : (
                <p className=' text-lg text-white'>Loading genres...</p>
            )}
        </div>
    );
}

export default GenresFilter;