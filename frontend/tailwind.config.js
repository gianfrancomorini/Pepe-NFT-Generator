/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    // Add any classes that might be getting purged
    'space-y-4',
    'flex',
    'items-start',
    'break-words',
    'font-bold',
    'mr-2',
    'text-blue-500',
    'hover:text-blue-600'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}