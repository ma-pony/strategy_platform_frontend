/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: {
        lg: "1200px",
      },
    },
    extend: {},
  },
  plugins: [],
};
