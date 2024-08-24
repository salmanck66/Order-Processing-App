/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E7E9D7',       // Custom blue
        secondary: '#E9E9E9',     // Custom amber
        accent: '#F7F7F7',        // Custom green
        neutral: '#6AAEC7',
        ternary: '#F1ECE2'
      },
    },
  },
  plugins: [],
}
