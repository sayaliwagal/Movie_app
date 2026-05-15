import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

const NoResults = ({ searchQuery = '', onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-12 px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-6">
          <FontAwesomeIcon 
            icon={faFilm} 
            className="text-6xl text-gray-500 mb-4 block"
          />
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-2">
          No Movies Found
        </h3>
        
        {/* Description */}
        <p className="text-gray-400 mb-4 max-w-md">
          {searchQuery 
            ? `We couldn't find any movies matching "${searchQuery}". Try adjusting your search or filters.`
            : 'No movies available. Please try adjusting your filters.'
          }
        </p>
        
        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default NoResults;
