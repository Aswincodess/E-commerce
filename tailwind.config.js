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
          black: '#1A0F12',
          muted: '#6B5A5E',
          soft: '#8A797D',

          background: '#F8F3F1',
          card: '#FFFFFF',
          cream: '#F8F3F1',
          section: '#F3E9E6',

          burgundy: '#6D1A2B',
          'burgundy-dark': '#531421',
        },
      },

    },
  },

  plugins: [],
};