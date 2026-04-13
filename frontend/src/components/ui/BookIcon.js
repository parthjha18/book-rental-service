import React from 'react';

const BookIcon = ({ className = "w-12 h-12" }) => {
  return (
    <img 
      src="/book-stack.png" 
      alt="Book Icon" 
      className={`${className} object-contain mx-auto`}
      onError={(e) => {
        e.target.style.display = 'none';
        const span = document.createElement('span');
        span.innerText = '📚';
        span.className = className;
        e.target.parentElement.appendChild(span);
      }}
    />
  );
};

export default BookIcon;
