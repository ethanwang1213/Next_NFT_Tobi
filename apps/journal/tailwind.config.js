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
      colors: {
        brown: "#894400",
        "secondary-main": "#3598AF",
        "neutral-main": "#717171",
        "disabled-input": "#A1A1A1",
        "disabled-input-content": "#5A5A5A",
        "primary-main": {
          DEFAULT: "#BC632F",
          100: "#F7E8E0",
          200: "#EFD2C0",
          300: "#E7BBA1",
          400: "#E0A481",
          500: "#D88D62",
          600: "#D07742",
          700: "#A05428",
          800: "#844621",
          900: "#68371a",
          1000: "#4C2813",
        },
        "neutral-base-white": "#FAFAFA",
        "text": {
          DEFAULT: "#BD6105",
          100: "#FEEBD9",
          200: "#FDD8B2",
          300: "#FCC48C",
          400: "#FBB065",
          500: "#FA9C3F",
          600: "#F98918",
          700: "#E37506",
          800: "#9C5004",
          900: "#7B3F03",
          1000: "#5B2E02",
        },
        "active": {
          DEFAULT: "#B91C1C",
        }
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
          info: "#1779DE",
          success: "#36D399",
          warning: "#B25748",
          error: "#FF4747",
        },
      },
    ],
  },
};

module.exports = config;
