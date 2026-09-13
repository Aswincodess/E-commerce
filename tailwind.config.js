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
        deskforge: {
          black: '#1C1C1C',
          muted: '#555555',
          soft: '#777777',

          background: '#F5F1EA',
          card: '#FFFFFF',
          cream: '#F7F3EC',
        },
      },

    },
  },

  plugins: [],
};