/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          hover: '#E85A2A',
        },
        secondary: {
          DEFAULT: '#2EC4B6',
          hover: '#27A99D',
        },
        cream: {
          DEFAULT: '#FFF9F0',
          50: '#FFFDFB',
          100: '#FFF9F0',
        },
        'dark-gray': '#333333',
      },
    },
  },
  plugins: [],
};
