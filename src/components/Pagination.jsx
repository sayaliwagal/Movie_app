import React from 'react';
import { Pagination } from 'flowbite-react';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center my-8">
      <Pagination
        currentPage={currentPage}
        totalPages={Math.min(totalPages, 500)} // TMDB API allows max 500 pages
        onPageChange={handlePageChange}
        showIcons
        layout="pagination"
      />
    </div>
  );
};

export default PaginationComponent;
