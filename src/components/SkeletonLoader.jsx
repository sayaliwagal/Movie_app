import React from 'react';

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
          {/* Skeleton Image */}
          <div className="bg-gray-700 h-80 w-full" />
          
          {/* Skeleton Content */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-8 bg-gray-700 rounded w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
