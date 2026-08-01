/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,mdx,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        forest: "#1A2E1A",
        moss: "#3D5C2E",
        stone: "#6F5A43",
        "stone-soft": "#8B7355",
        ember: "#C94B1A",
        "ember-light": "#F0834E",
        "ember-dark": "#A83C14",
        "ember-deep": "#8E3312",
        mist: "#D4CFC4",
        chalk: "#F5F2EC",
        ink: "#0F0F0D",
        earth: "#3D5C2E",
        water: "#3E5F73",
        fire: "#A83C14",
        air: "#F5F2EC",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        body: ["Lora", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        field: "0 24px 70px -42px rgba(15, 15, 13, 0.55)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
