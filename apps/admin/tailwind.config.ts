/** @type {import('tailwindcss').Config} */
import general from "../../packages/tailwind-config/tailwind.config.js";
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
        "3xl": ["32px", "48px"],
      },
      colors: {
        active: "#FF811C",
        attention: "#FF4747",
        "attention-content": "#FFFFFF",
        "base-76-content": "#717171C2",
        "base-200-content": "#5A5A5A",
        inactive: "#B3B3B3",
        "inactive-content": "#FFFFFF",
        popup: "#07396C",
        "popup-content": "#FFFFFF",
        "hover-item": "#E5F0FF",
        "disabled-field": "#A1A1A1",
        "base-white": "#FAFAFA",
        "base-black": "#0A0A0B",
        primary: {
          DEFAULT: "#1779DE",
          100: "#DDECFB",
          200: "#BAD9F8",
          300: "#98C6F4",
          400: "#76B2F1",
          500: "#539FED",
          600: "#318CEA",
          700: "#1467BD",
          800: "#10559C",
          900: "#0D437B",
          1000: "#093159",
        },
        secondary: {
          DEFAULT: "#717171",
          100: "#EBEBEB",
          200: "#D6D6D6",
          300: "#C2C2C2",
          400: "#AEAEAE",
          500: "#9A9A9A",
          600: "#858585",
          700: "#606060",
          800: "#505050",
          900: "#3F3F3F",
          1000: "#2E2E2E",
        },
        neutral: {
          100: "#E3E3E3",
          200: "#CCCBCB",
          300: "#B5B3B3",
          400: "#9F9C9C",
          500: "#898384",
          600: "#726C6C",
          700: "#5A5555",
          800: "#433E3F",
          900: "#2B2829",
          1000: "#151314",
        },
        success: {
          DEFAULT: "#37AD00",
          100: "#C6FFAB",
          200: "#8CFF57",
          300: "#53FF02",
          400: "#277C00",
        },
        warning: {
          DEFAULT: "#FF811C",
          100: "#FFD5B3",
          200: "#FFAB68",
          300: "#DB6100",
          400: "#9A4500",
        },
        error: {
          DEFAULT: "#FF4747",
          100: "#FFC2C2",
          200: "#FF8484",
          300: "#FB0000",
          400: "#B00000",
        },
      },
      textColor: {
        "title-color": "#717171",
        "input-color": "#4D4D4D",
        "placeholder-color": "#71717180",
      },
      borderColor: {
        "normal-color": "#717171",
        "input-color": "#71717180",
        "hover-color": "#4A90E2",
        "focus-color": "#FFA726",
      },
      width: {
        "18": "4.5rem",
        "26": "6.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "65": "16.25rem",
        "67": "16.725rem",
        "68": "17rem",
        "70": "17.5rem",
        "76": "19rem",
        "112": "28rem",
        "116": "29rem",
        "120": "30rem",
        "128": "32rem",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#1779DE",
          "primary-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-content": "#717171",
        },
      },
    ],
  },
};

export default config;
