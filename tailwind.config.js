/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['+(pages|src)/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      dropShadow: {
        'item-icon-light': '0 1px 2px rgb(0 0 0 / .18)',
        'item-icon-dark': '0 1px 2px rgb(255 255 255 / .22)',
      },
    },
  },
  darkMode: ['class', '.dark-theme'],
  plugins: [],
};
