import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggler = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`relative overflow-hidden rounded-full shadow-lg transition-all duration-300 w-12 h-12 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background glow effect */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-800 to-purple-900 opacity-60' 
            : 'bg-gradient-to-br from-yellow-200 to-orange-300 opacity-60'
        }`} />
        
        {/* Main toggle button */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 transform ${
            isHovering ? 'scale-110' : ''
          } ${theme === 'dark' ? 'text-yellow-300' : 'text-orange-500'}`}
        >
          {theme === 'dark' ? (
            <Moon className={`${isHovering ? 'animate-pulse' : ''}`} size={24} />
          ) : (
            <Sun className={`${isHovering ? 'animate-spin' : ''}`} size={24} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggler;