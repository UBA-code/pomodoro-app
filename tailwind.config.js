/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'html': '#1E213E',
        'white-text': '#D6DFFF',
        'dark-blue': '#161932',
        'light-gray': '#CCCDD4',
      },
	  transitionDuration: {
		'Default': '9000ms',
	  }
    },
  },
  plugins: [],
}

