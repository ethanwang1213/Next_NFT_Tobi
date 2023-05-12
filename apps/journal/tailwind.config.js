/** @type {import('tailwindcss').Config} */
const general = require("../../packages/tailwind-config/tailwind.config.js");
const config = {
  ...general,
  theme: {
    screens: {
      sm: "576px", // landscape phones
      md: "992px", // desktops
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
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#BE6105",
          secondary: "#FDFAF1",
          "secondary-focus": "#dbd3ba",
          "secondary-content": "#7D5337",
          accent: "#753A00",
          "accent-content": "#FDFAF1",
          neutral: "#000000",
          "base-100": "#FBEED0",
          info: "#137BB1",
          success: "#36D399",
          warning: "#B25748",
          error: "#E5574B",
        },
      },
    ],
  },
};

module.exports = config;
