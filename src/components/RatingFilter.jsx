import React, { useState } from 'react'
import { Dropdown } from "flowbite-react";

const RatingFilter = ({ onRatingChange, selectedRatings }) => {
    // Fixed: Changed object destructuring {} to array destructuring []
    const [ratings, setRatings] = useState([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

    //Toggle rating selection
    const handleRatingToggle = (rating) => {
        //Convert to string for consistent comparison
        const ratingStr = String(rating);

        //Check if the rating is already selected
        if(selectedRatings.includes(ratingStr)){
            //If selected, remove it 
            const updatedRatings = selectedRatings.filter(r => r !== ratingStr);
            onRatingChange(updatedRatings);
        }else{
            // If not selected, add it 
            const updatedRatings = [...selectedRatings, ratingStr];
            onRatingChange(updatedRatings);
        }
    };
    
    
    return (
        <div className='mb-4 relative'>
            <Dropdown 
        label={
               <span className="text-white font-semibold text-lg cursor-pointer">
                     Rating {selectedRatings.length > 0 &&  `(${selectedRatings.length})`} 
                </span>
              }
                inline   
                arrowIcon={false}
                >
           
           
                {ratings.map(rating => (
                  <div 
                   key={rating}
                   className='px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center'
                   onClick={() => handleRatingToggle(rating)}
                   >
                <input 
                    type='checkbox'
                    className='mr-2'
                    checked={selectedRatings.includes(String(rating))}
                    onChange={() => {}} // Enpty onChange to avoid React warnning
                    id={`rating-${rating}`} 
                />                   
                <label htmlFor={`rating-${rating}`} className='cursor-pointer flex-grow'>
                        {rating}+    
                </label>  
               </div>              
                 ))}
                 </Dropdown>
                 {/* Display selected ratings as tags */}
    {selectedRatings.length > 0 && (
        <div className="selected-ratings flex flex-wrap gap-2 mt-2">
            {selectedRatings.map(rating => (
                <span
                key={rating}
                className='bg-yellow-500 text-white px-2 py-1 rounded-md text-sm flex items-center'>
                    {rating}+
                    <button
                        onClick={() => handleRatingToggle(rating)}
                        className="ml-2 text-white">
                            X
                    </button>                
                </span> 
            ))}
        </div>
    )}
        </div>
    );
}

export default RatingFilter;