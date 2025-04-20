/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme:  {
    extend: {animation: {
      'progress-bar': 'progress 3s ease-in-out infinite',
      'bounce': 'delay-bounce 1s infinite',
      'delay-100': 'delay-bounce 1s infinite 0.1s',
      'delay-200': 'delay-bounce 1s infinite 0.2s',
    },
      colors: {
        // Primary colors from Flutter theme
        primary: {
          light: '#42A5F5', // Secondary color in Flutter (Blue 400)
          DEFAULT: '#2196F3', // Primary color in Flutter (Material Blue)
          dark: '#0D47A1', // Darker shade for hover states
        },
        error: '#E53935',    // Red 600
        success: '#43A047',  // Green 600
        warning: '#FFA000',  // Amber 700
        info: '#0288D1',     // Light Blue 700
        
        light: {
          background: '#F5F5F5', // Slightly off-white
          surface: '#FFFFFF',    // White
          text: 'rgba(0, 0, 0, 0.87)', // Black87
        },
        
        dark: {
          background: '#121212',  // Standard Material dark background
          surface: '#202020',     // Slightly lighter than background
          text: '#FFFFFF',        // White
        }
      },
      borderRadius: {
        'standard': '12px',   // _borderRadius in Flutter
        'button': '8px',      // _buttonBorderRadius in Flutter
      },
      fontSize: {
        // Matches Flutter's text theme sizes
        'display-lg': '32px',
        'display-md': '28px',
        'display-sm': '24px',
        'headline-lg': '22px',
        'headline-md': '20px',
        'headline-sm': '18px',
        'title-lg': '16px',
        'title-md': '14px',
        'title-sm': '12px',
        'body-lg': '16px',
        'body-md': '14px',
        'body-sm': '12px',
        'label-lg': '14px',
        'label-md': '12px',
        'label-sm': '10px',
      },
      fontWeight: {
        // Matches Flutter's font weights
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'card-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
    }},
  
}