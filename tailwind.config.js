/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",  // This scans all JS/JSX/TS/TSX files in the src folder.
  "./public/index.html",  // Include your main HTML file if you're using it.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

