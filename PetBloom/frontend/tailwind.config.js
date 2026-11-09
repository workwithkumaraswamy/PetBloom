/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EDE5D8',
          400: '#DFD4C2',
          500: '#CFC0A9',
        },
        sage: {
          50: '#F4F6F4',
          100: '#E5EAE5',
          200: '#CBD6CB',
          300: '#A7BBA7',
          400: '#7A8B7B',
          500: '#5E7060',
          600: '#4A584C',
          700: '#39443B',
          800: '#2A322C',
        },
        gold: {
          50: '#FAF8F2',
          100: '#F5EEDD',
          200: '#ECDDBA',
          300: '#DFC790',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A58241',
          700: '#7F6230',
        },
        charcoal: {
          50: '#F7F7F7',
          100: '#EAEAEA',
          200: '#D1D1D1',
          300: '#A8A8A8',
          400: '#737373',
          500: '#4A4A4A',
          600: '#333333',
          700: '#242424',
          800: '#1A1A1A',
          900: '#111111',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
