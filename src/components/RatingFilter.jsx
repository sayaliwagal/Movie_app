import React, { useState } from 'react'
import { Dropdown, DropdownItem } from "flowbite-react";

const RatingFilter = ({ onRatingChange, selectedRatings }) => {
    // Fixed: Changed object destructuring {} to array destructuring []
    const [ratings, setRatings] = useState([7, 6, 5, 4, 3, 2, 1]);
    
    const handleRatingChange = (e) => {
        // Fixed: Extract the value from each option
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        
        // Moved console.log outside of JSX
        console.log("Ratings in RatingFilter:", ratings);
        
        // Pass the selected values to the parent component
        onRatingChange(selectedOptions);
    };
    
    return (
        <div className='mb-4'>
            <Dropdown 
        label={<span className="text-white font-semibold text-lg cursor-pointer">Rating </span>} inline multiple 
                onChange={handleRatingChange} 
                value={selectedRatings}   arrowIcon={false}>
           
           
                {ratings.map(rating => (
                     <DropdownItem key={rating} value={rating}>
                          {rating}+
                    </DropdownItem>
                ))}

            
            </Dropdown>
    
        </div>
    );
}

export default RatingFilter