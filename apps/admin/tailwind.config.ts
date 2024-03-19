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
      backgroundImage: {
        "tobiratory-logo": "url('/admin/images/bg-logo.svg')",
      }
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
