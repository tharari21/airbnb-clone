/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // technically only need /app folder but if you want to play around in these other folders we now can
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
