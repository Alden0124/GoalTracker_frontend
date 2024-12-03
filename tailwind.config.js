/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "Noto Sans TC": ["Noto Sans TC", "sans-serif"],
      },
      colors: {
        background: {
          light: "#ffffff",
          dark: "#23272F",
          secondaryLight: "#F3F4F6",
          secondaryDark: "#111827",
        },
        foreground: {
          light: "#23272F",
          dark: "#ffffff",
          lightBlue: "#276DF4",
          darkBlue: "#1f2937",
          darkHover: "#2D3A4F4D",
        },
        border: {
          light: "#e5e7eb",
          dark: "#e5e7eb",
        },
        button: {
          light: "#276DF4",
          dark: "transparent",
          darkHover: "#2D3A4F4D",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  darkMode: "class",
};
