/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // DataTrace brand palette — dark mode with red and white accents
        brand: {
          red: '#E53E3E',
          'red-light': '#FC8181',
          'red-dark': '#C53030',
          dark: '#0F0F0F',
          'dark-card': '#1A1A1A',
          'dark-border': '#2D2D2D',
          'dark-muted': '#3D3D3D',
          white: '#FFFFFF',
          'white-muted': '#A0AEC0',
          'white-dim': '#718096'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
};
