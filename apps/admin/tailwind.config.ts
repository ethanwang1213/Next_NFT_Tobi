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
      },
      colors: {
        active: "#FF811C",
        attention: "#FF4747",
        "attention-content": "#FFFFFF",
        "base-76-content": "#717171C2",
        "base-200-content": "#5A5A5A",
        "non-active": "#B3B3B3",
        popup: "#07396C",
        "popup-content": "#FFFFFF",
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
