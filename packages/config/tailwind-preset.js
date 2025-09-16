/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e6edff',
          200: '#c4d5ff',
          300: '#9bb6ff',
          400: '#6f90ff',
          500: '#4f73ff',
          600: '#3c57e6',
          700: '#2f43b3',
          800: '#27378f',
          900: '#1f2b6e',
        },
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};


