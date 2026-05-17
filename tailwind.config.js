/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto_400Regular'],
        roboto: ['Roboto_400Regular'],
        'roboto-medium': ['Roboto_500Medium'],
        'roboto-bold': ['Roboto_700Bold'],
        'roboto-black': ['Roboto_900Black'],
      },
    },
  },
  plugins: [],
};
