/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		animation: {
  			'progress-bar': 'progress 3s ease-in-out infinite',
  			bounce: 'delay-bounce 1s infinite',
  			'delay-100': 'delay-bounce 1s infinite 0.1s',
  			'delay-200': 'delay-bounce 1s infinite 0.2s'
  		},
  		colors: {
  			primary: {
  				light: '#42A5F5',
  				DEFAULT: 'hsl(var(--primary))',
  				dark: '#0D47A1',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			error: '#E53935',
  			success: '#43A047',
  			warning: '#FFA000',
  			info: '#0288D1',
  			light: {
  				background: '#F5F5F5',
  				surface: '#FFFFFF',
  				text: 'rgba(0, 0, 0, 0.87)'
  			},
  			dark: {
  				background: '#121212',
  				surface: '#202020',
  				text: '#FFFFFF'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			standard: '12px',
  			button: '8px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
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
  			'label-sm': '10px'
  		},
  		fontWeight: {
  			normal: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700'
  		},
  		boxShadow: {
  			'card-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
  			'card-dark': '0 4px 8px rgba(0, 0, 0, 0.3)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}