import React, { useState, useEffect } from 'react'
import {Dropdown} from "flowbite-react";

const GenresFilter = ({ onGenreChange, selectedGenres }) => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
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
             } finally{
                    setLoading(false);
                }
            
        };

        fetchGenres();
    }, [API_KEY]); // Added API_KEY as a dependency

    /*const handleGenreChange = (e) => {
        // Convert to numbers since TMDB genre IDs are numbers
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
        onGenreChange(selectedOptions);
    };*/
    // Toggle genre selection
    const handleGenreToggle = (genreId) => {
        //Convert to number to ensure consistent comparison 
        genreId = Number(genreId);
        
        //check if the genre is already selected
        if(selectedGenres.includes(genreId)){
            //If selected, remove it
            const updatedGenres = selectedGenres.filter(id => id !== genreId);
            onGenreChange(updatedGenres);
        }else{
            //If not selected, add it 
            const updatedGenres = [...selectedGenres, genreId];
            onGenreChange(updatedGenres);
        }

    };

    //get genre name by Id
    const getGenreName = (genreId) => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : '';
    };


    return (
        <div className='mb-4' relative>
            {loading  ? (
                <p className="text-lg text-white">Loading genres...</p>
            ) : (
                   <>
                   <Dropdown 
                   label ={
                    <span className='text-amber-50 font-semibold text-lg cursor-pointer'>
                        Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}
                    </span>
                   }
                   inline
                   arrowIcon={false}>
                    {genres.map(genre => (
                            <div 
                            key={genre.id}
                            className='px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center'
                            onClick={() => handleGenreToggle(genre.id)}
                            >
                                <input
                                type='checkbox'
                                className='mr-2'
                                checked={selectedGenres.includes(genre.id)}
                                onChange={() =>{}} //Empty onChange to avoid React warning.
                                id={`genre-${genre.id}`}
                                />
                                <lable htmlFor={`genre-${genre.id}`} className= 'cursor-pointer flrx-grow'>
                                {genre.name}</lable>
                            </div>    
                    ))}
                   </Dropdown>

                   {/* Display selected genres as tags  */}
                   {selectedGenres.length > 0 && (
                    <div className="selected-gernres flex flex-wrap gap-2 mt-2">
                        {selectedGenres.map(genreId => (
                            <span 
                            key={genreId}
                            className='bg-blue-500 text-white px-2 py-1 rounded-md text-sm flex items-center'
                            >{getGenreName(genreId)}
                                <button
                                onClick={() => handleGenreToggle(genreId)}
                                className='ml-2 text-white'>X
                                </button>
                                </span>
                   )) }
                                     
           
                    </div>
                   )}
                   </> )}
         
            
        </div>
    );
};

export default GenresFilter;