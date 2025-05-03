import React, {useState, useEffect} from 'react'
import { Dropdown, DropdownItem} from "flowbite-react";

const YearFilter = ( {onYearChange, selectedYears}) => {
    const [years, setYears] = useState([]);
    // const [selectedYears, setSelectedYears] = useState([]);
    useEffect(() =>{
        const currentYear = new Date().getFullYear();
        const yearRange = Array.from({ length: 50 }, (_, index) => currentYear - index);
        setYears(yearRange);
    }, []);

    const  handleYearChnage = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        onYearChange(selectedOptions);
    };

  return (
    <div className='mb-4'>
        <Dropdown 
                       label={<span className="text-white font-semibold text-lg cursor-pointer">Year </span>} inline multiple 
                       onChange={handleYearChnage} value={selectedYears} arrowIcon={false}>
     {years.map(year => (
        <DropdownItem key = {year} value = {year}>
            {year}
        </DropdownItem>
        ))}
     </Dropdown>
    </div>
  )
}

export default YearFilter
