/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // blue-500
        'primary-hover': '#2563eb', // blue-600
        secondary: '#374151', // gray-700
        accent: '#f3f4f6', // gray-100
        'card-bg': '#ffffff', // white
        'text-muted': '#6b7280', // gray-500
        'text-secondary': '#4b5563', // gray-600
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

