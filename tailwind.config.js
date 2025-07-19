/** @type {import('tailwindcss').Config} */
module.exports = {
  // Incluye todas las rutas relevantes para Expo Router (app, components, etc.)
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}