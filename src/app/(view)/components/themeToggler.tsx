import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  // We use a simple trick to ensure the component is mounted on the client
  // before rendering, preventing hydration mismatch issues with next-themes.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or nothing on the server
    return <div className="w-24 h-12" />; 
  }
  
  const isDarkMode = theme === 'dark';

  return (
    <button
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className={`
        relative w-24 h-12 rounded-full
        flex items-center justify-center
        overflow-hidden
        transition-all duration-1000 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-background focus:ring-sky-500/50 dark:focus:ring-indigo-500/50
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-indigo-900 to-black' 
          : 'bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600'
        }
      `}
    >
      {/* Stars - visible in dark mode */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <div className="absolute top-[20%] left-[10%] w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[40%] left-[80%] w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-[70%] left-[50%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[80%] left-[20%] w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.2s' }}></div>
      </div>

      {/* Clouds - visible in light mode */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        <div className="absolute top-[25%] -left-4 w-12 h-6 bg-white/40 rounded-full animate-drift" style={{ animationDuration: '25s' }}></div>
        <div className="absolute top-[50%] -left-8 w-16 h-8 bg-white/30 rounded-full animate-drift" style={{ animationDuration: '35s', animationDelay: '-5s' }}></div>
      </div>
      
      {/* Sun Icon */}
      <div className={`
        absolute
        transition-all duration-1000 ease-in-out
        transform
        ${isDarkMode ? '-translate-y-24 rotate-45' : 'translate-y-0 rotate-0'}
      `}>
        <Sun size={28} className="text-yellow-300" />
      </div>

      {/* Moon Icon */}
      <div className={`
        absolute
        transition-all duration-1000 ease-in-out
        transform
        ${isDarkMode ? 'translate-y-0 rotate-0' : 'translate-y-24 rotate-45'}
      `}>
        <Moon size={24} className="text-slate-300 fill-slate-300" />
      </div>
    </button>
  );
};

export default ThemeToggler;