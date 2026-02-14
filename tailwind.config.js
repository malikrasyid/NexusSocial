/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo-600 (Our Brand Color)
        secondary: '#1F2937', // Gray-800
        background: '#F3F4F6', // Gray-100
      }
    },
  },
  plugins: [],
}