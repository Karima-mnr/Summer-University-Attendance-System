/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#0B6B3A',
          600: '#1a8a4a',
          700: '#08522e',
          800: '#06401e',
          900: '#042e14',
        },
        secondary: {
          50: '#fde8ea',
          100: '#fcc8cc',
          200: '#f9a0a6',
          300: '#f57880',
          400: '#f0505a',
          500: '#CE1126',
          600: '#e6192e',
          700: '#b00e1e',
          800: '#8a0b16',
          900: '#64080f',
        },
        accent: {
          50: '#fef3e8',
          100: '#fde3c8',
          200: '#fbcba0',
          300: '#f9b378',
          400: '#f79b50',
          500: '#F2891D',
          600: '#f4a33e',
          700: '#d67a0e',
          800: '#b0600a',
          900: '#8a4606',
        },
      },
    },
  },
  plugins: [],
}