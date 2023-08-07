/** @type {import('tailwindcss').Config} */
const general = require("../../packages/tailwind-config/tailwind.config.js");
const config = {
  ...general,
  content: [
    "components/**/*.{js,ts,jsx,tsx}",
    "pages/**/*.{js,ts,jsx,tsx}",
    "contexts/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "576px", // landscape phones
      md: "992px", // desktops
    },
    extend: {
      fontFamily: {
        body: ["fot-tsukubrdgothic-std", "sans-serif"],
      },
      fontSize: {
        redeemStatus: {
          pc: {
            checking: 72,
            success: 84,
            error: 84,
          },
          sp: {
            checking: 26,
            success: 36,
            error: 34,
          },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#BE6105",
          secondary: "#FDFAF1",
          "secondary-focus": "#dbd3ba",
          "secondary-content": "#7D5337",
          accent: "#7D5337",
          "accent-content": "#FDFAF1",
          neutral: "#FFFFFF",
          "neutral-focus": "#F0F0F0",
          "neutral-content": "#8C8C8C",
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
