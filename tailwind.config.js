/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,vue}",
    "./public/**/*.html",
    "./**/*.html",
    "./header.html",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'puc-blue': '#42929d',
        'puc-light-blue': '#0066CC',
        'puc-gold': '#FFD700',
        'puc-gray': '#666666',
        'puc-light-gray': '#F5F5F5'
      },
      fontFamily: {
        'puc': ['Arial', 'sans-serif']
      }
    }
  },
  plugins: [],
}