const { colors, fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matte: {
          DEFAULT: "#272727",
        },
        warmth: {
          DEFAULT: "#FFFBF5",
        },
        clarity: {
          DEFAULT: "#FFFFFF",
        },
        grain: {
          DEFAULT: "#DDFAAB",
        },
        growth: {
          DEFAULT: "#9EC778",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", ...fontFamily.sans],
        display: ["bennet-banner", ...fontFamily.serif],
      },
    },
  },
  plugins: [],
};
