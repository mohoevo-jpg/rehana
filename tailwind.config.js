/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'], // Arabic font
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: 'var(--color-primary-600)', // Using variable for main shade
          600: 'var(--color-primary-600)', // Using variable for main shade
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}
