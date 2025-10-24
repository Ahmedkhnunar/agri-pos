module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "hidden", "block", "flex", "w-64", "w-0", "translate-x-0", "-translate-x-full"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
