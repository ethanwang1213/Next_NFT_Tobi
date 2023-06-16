/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      tab: "520px",
      pc: "960px",
      hd: "1921px",
    },
    extend: {
      fontFamily: {
        // tsukua: ['fot-tsukuardgothic-std'],
        // tachyon: ['tachyon'],
      },
      colors: {
        offwhite: "#F2F2F2",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#047AFF",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#414142",
          "base-100": "#F2F2F2",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#047AFF",
        },
      },
    ],
  },
};
