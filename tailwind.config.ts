/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A45',
          hover: '#FF956B'
        }
      }
    }
  },
  plugins: []
} 