/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      backgroundImage: {
        'home-bg': "url('/public/bg.jpg')",
      },
      colors: {
        'regal-blue': 'rgba(43,29,87)',
         'dark-blue':'rgba(17,25,40,0.5)',
      },
    },
  },
  plugins: [],
}

