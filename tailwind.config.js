/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#001CAD',
          200: '#2A2A2A'
        }
      }
    },
  },
  plugins: [],
}

