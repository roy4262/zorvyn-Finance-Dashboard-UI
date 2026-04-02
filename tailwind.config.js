/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          accent: '#3B82F6',
          text: '#F8FAFC',
          muted: '#94A3B8'
        }
      }
    },
  },
  plugins: [],
}
