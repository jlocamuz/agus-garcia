/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}', // si usás la App Router
  ],
  theme: {
    extend: {
      colors: {
        oliva: '#bac5a4',
        olivaclaro: '#edf2eb',
        rosa: '#cda2a2',
      }

    },

    
  },
  plugins: [],
};
