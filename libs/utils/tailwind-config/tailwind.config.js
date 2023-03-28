/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['components/**/*.{js,ts,jsx,tsx}', 'pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '520px',
      md: '960px',
    },
    extend: {
      fontFamily: {},
    },
  },
  plugins: [require('daisyui')],
};
