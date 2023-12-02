/** @type {import('tailwindcss').Config} */
const general = require("../../packages/tailwind-config/tailwind.config.js");
const config = {
  ...general,
  content: [
    "src/components/**/*.{js,ts,jsx,tsx}",
    "src/pages/**/*.{js,ts,jsx,tsx}",
    "src/contexts/**/*.{js,ts,jsx,tsx}",
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
      colors: {
        brown: "#894400",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#287BDB",
          secondary: "#FDFAF1",
          "secondary-focus": "#dbd3ba",
          "secondary-content": "#7D5337",
          accent: "#7D5337",
          "accent-content": "#FDFAF1",
          neutral: "#FFFFFF",
          "neutral-focus": "#F0F0F0",
          "neutral-content": "#8C8C8C",
          "base-100": "#FFFFFF",
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