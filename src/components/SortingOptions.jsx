import React from 'react'
import { Dropdown, DropdownItem } from "flowbite-react";

const SortingOptions = ({onSortChange, currentSortOption}) => {
    const handleSortChange = (value) => {
        onSortChange(value);
    }
  return (
    <div>
        <Dropdown 
         label={<span className="text-white font-semibold text-lg cursor-pointer">Sort by </span>} inline
        onChange={handleSortChange} 
         value={currentSortOption}   arrowIcon={false}>
            <DropdownItem value="popularity.desc" onClick={() => handleSortChange('popularity.desc')} active={currentSortOption === "popularity.desc"}>popularity (Descending)</DropdownItem>
            <DropdownItem value="release_date.desc" onClick={() => handleSortChange('release_date.desc')} active={currentSortOption === "release_date.desc"}>Release Date (Newest First)</DropdownItem>
            <DropdownItem value="vote_average.desc" onClick={() => handleSortChange('vote_average.desc')} active={currentSortOption === "vote_average.desc"}>User Rating (Highest First)</DropdownItem>
            <DropdownItem value="original_title.desc" onClick={() => handleSortChange('original_title.desc')} active= {currentSortOption === "original_title.desc"}>Title (A-Z) (Descending)</DropdownItem>

         </Dropdown>
    </div>
  )
}

export default SortingOptions
