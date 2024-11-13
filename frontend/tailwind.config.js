/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Add this to ensure Tailwind generates all the classes we're using
  safelist: [
    'bg-gray-100',
    'bg-white',
    'rounded-lg',
    'shadow-lg',
    'text-emerald-600',
    'text-blue-500',
    'hover:text-blue-600',
    'bg-emerald-600',
    'hover:bg-emerald-700',
    'bg-purple-600',
    'hover:bg-purple-700',
    'bg-red-100',
    'border-red-400',
    'text-red-700'
  ]
}