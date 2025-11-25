import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#061A2F",
          "navy-light": "#102C4C",
          "navy-dark": "#030B17",
          blue: "#1F6FEB",
          "blue-light": "#6AA8FF",
          green: "#2BB673",
          "green-light": "#4DDB9D",
          "green-dark": "#1A7F4D",
          gold: "#F7B500",
          "gold-light": "#FFE3A3",
          "gold-dark": "#B87A02",
          grey: "#F3F5F9",
          ai: "#9E8CFF",
        },
        flo: {
          navy: "#021027",
          blue: "#0F5FFF",
          green: "#16C47F",
        },
      },
      fontFamily: {
        heading: ["Montserrat", ...defaultTheme.fontFamily.sans],
        body: ["Lato", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "brand-ai": "0 35px 60px -15px rgba(22, 196, 127, 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #061A2F 0%, #0F5FFF 50%, #2BB673 100%)",
        "brand-gradient-hero": "linear-gradient(135deg, rgba(6,26,47,0.95) 0%, rgba(47,72,140,0.9) 45%, rgba(43,182,115,0.85) 100%)",
      },
    },
  },
  plugins: [],
}
