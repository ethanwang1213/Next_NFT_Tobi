/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["components/**/*.{js,ts,jsx,tsx}", "pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "520px", // TODO:スマホ表示の閾値を適切な値に更新する
      md: "960px", // TODO:タブレット表示の閾値を適切な値に更新する
    },
    extend: {
      fontFamily: {},
    },
  },
  plugins: [require("daisyui")],
};
