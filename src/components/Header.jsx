import React from 'react';

const Header = ({ backgroundImage, title, subtitle, children }) => {
  return (
    <header className="relative mb-12 overflow-hidden rounded-lg">
      {/* Background Image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Header Background"
          className="w-full h-48 object-cover opacity-60"
        />
      )}
      
      {/* Content Overlay */}
      <div className="relative px-4 py-8 sm:px-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {title && (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              {title}
            </h1>
          )}
          
          {subtitle && (
            <p className="text-gray-300 text-base sm:text-lg">
              {subtitle}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
