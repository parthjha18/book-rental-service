import React from 'react';

const Logo = ({ className = "w-11 h-11", textClassName = "text-xl" }) => {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className={`${className} flex-shrink-0 rounded-lg overflow-hidden bg-orange-500/10 flex items-center justify-center shadow-lg shadow-orange-500/5 group-hover:shadow-orange-500/20 transition-all duration-300`}>
        <img 
          src="/logo.png" 
          alt="BookShare Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '📚';
          }}
        />
      </div>
      <span className={`${textClassName} font-bold tracking-tight text-white`}>
        Book<span className="gradient-text">Share</span>
      </span>
    </div>
  );
};

export default Logo;
