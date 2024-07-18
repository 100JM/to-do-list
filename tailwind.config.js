/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['IBM Plex Sans KR', 'sans-serif']
        sans: ['Gmarket Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
}

