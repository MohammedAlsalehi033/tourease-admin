import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`
        relative w-24 h-12 rounded-full
        transition-all duration-300 ease-in-out
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        shadow-inner
      `}
    >
      {/* Toggle Handle */}
      <div
        className={`
          absolute top-1 w-6 h-6 rounded-full
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800
          shadow-md
          flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
        `}
      >
        {/* Sun Icon */}
        <Sun
          size={14}
          className={`
            transition-all duration-300 ease-in-out
            text-yellow-500
            ${theme === 'dark' ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}
          `}
        />
        {/* Moon Icon */}
        <Moon
          size={14}
          className={`
            absolute transition-all duration-300 ease-in-out
            text-blue-400
            ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}
          `}
        />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className={`
            absolute inset-0
            transition-all duration-300 ease-in-out
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900' 
              : 'bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300'
            }
            opacity-20
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggler;