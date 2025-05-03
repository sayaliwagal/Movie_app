import React from 'react';

const Search = ({search, setSearch})  => {
  return (
    <div className='search'>
       <div>
           <img src="./search.svg" alt="search" />
            <input id='search' type='text' placeholder='Search your Favorite Movie here ...'
              value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
    </div>
  )

}

export default Search;
