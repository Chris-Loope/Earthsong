/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,mdx,js,ts}'],
    theme: {
      extend: {
        colors: {
          ink: '#1F1F1F',
          earth: '#566B4A',
          water: '#3E5F73',
          fire:  '#C75B39',
          air:   '#E8ECF1'
        }
      }
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
  };