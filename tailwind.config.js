/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        bronze: {
          light: '#D2A679',
          DEFAULT: '#B8875A',
          dark: '#8C6640',
        },
      },
    },
  },
  plugins: [],
}