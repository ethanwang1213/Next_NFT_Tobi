/** @type {import('tailwindcss').Config} */
const general = require("../../packages/tailwind-config/tailwind.config.js");
const config = {
  ...general,
  theme: {
    screens: {
      sm: "520px", // TODO:スマホ表示の閾値を適切な値に更新する
      md: "960px", // TODO:タブレット表示の閾値を適切な値に更新する
    },
    extend: {
      fontFamily: {
        body: ["fot-tsukubrdgothic-std", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#BE6105",
          secondary: "#F8F0D8",
          accent: "#137BB1",
          neutral: "#7D5337",
          "base-100": "#FCF9F1",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FACC15",
          error: "#E5574B",
        },
      },
    ],
  },
};

module.exports = config;
