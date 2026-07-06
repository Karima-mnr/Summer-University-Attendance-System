/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#0B6B3A',
          600: '#1a8a4a',
          700: '#08522e',
        },
        secondary: {
          500: '#CE1126',
          600: '#e6192e',
          700: '#b00e1e',
        },
        accent: {
          500: '#F2891D',
          600: '#f4a33e',
        },
      },
    },
  },
  plugins: [],
}
