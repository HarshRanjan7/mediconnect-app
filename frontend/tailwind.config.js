// File Path: frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ... (keep your existing colors and fonts)
      colors: {
        'primary': '#1E88E5',
        'primary-dark': '#1565C0',
        'secondary': '#26A69A',
        'text-dark': '#212121',
        'text-light': '#616161',
        'extra-light': '#F5F5F5',
        'white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
