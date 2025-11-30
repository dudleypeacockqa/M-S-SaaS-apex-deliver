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
          // Slate colors for backgrounds and text
          slate: {
            900: "#0F172A",
            800: "#1E293B",
            700: "#334155",
            600: "#475569",
            400: "#94A3B8",
            300: "#CBD5E1",
          },
          // Teal colors for primary CTAs and accents
          teal: {
            700: "#0F766E",
            600: "#0D9488",
            400: "#2DD4BF",
          },
          // Blue colors for secondary elements and gradients
          blue: {
            900: "#1E3A8A",
            600: "#2563EB",
            400: "#60A5FA",
          },
          // Legacy aliases for compatibility (map to Teal/Blue)
          navy: "#0F172A", // Slate 900
          "navy-light": "#1E293B", // Slate 800
          "navy-dark": "#0F172A", // Slate 900
          grey: "#F3F5F9",
        },
      },
      fontFamily: {
        heading: ["Montserrat", ...defaultTheme.fontFamily.sans],
        body: ["Lato", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "brand-ai": "0 35px 60px -15px rgba(13, 148, 136, 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0F172A 0%, #2563EB 50%, #0D9488 100%)",
        "brand-gradient-hero": "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(37,99,235,0.9) 45%, rgba(13,148,136,0.85) 100%)",
      },
    },
  },
  plugins: [],
}
