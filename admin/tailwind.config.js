/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // include all your src files
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#7e30c4"
      }
    },
  },
  plugins: [],
}
