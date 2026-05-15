import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlay } from '@fortawesome/free-solid-svg-icons';

const MovieCardEnhanced = ({ movie: { id, title, vote_average, poster_path, original_language, release_date, overview } }) => {
  return (
    <Link to={`/movie/${id}`}>
      <div className="group relative h-full bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
        {/* Poster Image Container */}
        <div className="relative h-80 overflow-hidden bg-gray-700">
          <img
            src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/No-Poster.svg'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <FontAwesomeIcon icon={faPlay} className="text-white text-4xl" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-white text-sm line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>

          {/* Rating and Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
              <span className="text-yellow-400 font-semibold text-sm">
                {vote_average ? vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              {release_date ? release_date.split('-')[0] : 'N/A'}
            </span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded font-semibold">
              {original_language.toUpperCase()}
            </span>
          </div>

          {/* Overview Snippet */}
          {overview && (
            <p className="text-gray-300 text-xs line-clamp-2 mb-3">
              {overview}
            </p>
          )}

          {/* View Details Button */}
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MovieCardEnhanced;
