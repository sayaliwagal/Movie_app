import React, {useState, useEffect} from 'react'
import { Dropdown} from "flowbite-react";

const YearFilter = ( {onYearChange, selectedYears}) => {
    const [years, setYears] = useState([]);
    // const [selectedYears, setSelectedYears] = useState([]);
    useEffect(() =>{
        const currentYear = new Date().getFullYear();
        const yearRange = Array.from({ length: 50 }, (_, index) => currentYear - index);
        setYears(yearRange);
    }, []);
    //This function handles toggling a year in the selection
    const handleYearToggle = (year) => {
      //Conver year to string to ensure consistent comparison 
      const yearStr = String(year);
      //Ceck if the year is already selected
      if(selectedYears.includes(yearStr)){
        //If selected, remove it
        const updatedYears = selectedYears.filter(y => y !== yearStr);
        onYearChange(updatedYears);
      }else{
        // If not selected, add it 
        const updatedYears = [...selectedYears, yearStr];
        onYearChange(updatedYears);
      }

    }

    // const  handleYearChnage = (e) => {
    //     const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    //     onYearChange(selectedOptions);


  return (
    <div className='mb-4 relative'>
        <Dropdown 
                       label={
                       <span className="text-white font-semibold text-lg cursor-pointer">
                        Year {selectedYears.length > 0 && (`${selectedYears.length}`)} 
                        </span>
                        }
                         inline arrowIcon={false}
                         >
     {years.map(year => (
        <div key={year} 
        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex item-center"
        onClick={() => handleYearToggle(String(year))}>
          <input type="checkbox"
          className='mr-2'
          checked={selectedYears.includes(String(year))}
          onChange={() =>{}}  //Empty onchange to avoid React warning
          id={`year-${year}`} />
          <label htmlFor={`year-${year}`} className='cursor-pointer flex-grow'>
            {year}
          </label>
                 </div>
       
        ))}
     </Dropdown>
     {/* Display selected years as tags */}
     {selectedYears.length > 0 && (
      <div className="selected-years flex flex-wrap gap-2 mt-2">
        {selectedYears.map(year => (
          <span
          key={year}
          className='bg-green-500 text-amber-50 px-2 py-1 rounded-md text-sm flex items-center'
          >{year}
          <button onClick={() => handleYearToggle(year)}
          className='ml-2 text-amber-50'>X</button></span>
      ))}
      </div>
     )}
    </div>
  );
};

export default YearFilter
