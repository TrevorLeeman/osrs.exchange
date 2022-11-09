const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['+(pages|src)/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      '3xs': '300px',
      '2xs': '360px',
      xs: '400px',
      ...defaultTheme.screens,
    },
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
