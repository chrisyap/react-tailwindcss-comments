/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Prevent conflicts with user's Tailwind config
  corePlugins: {
    preflight: false,
  },
};
