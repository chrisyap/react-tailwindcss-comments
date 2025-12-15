/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "../src/**/*.{ts,tsx}", // include your library source
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
