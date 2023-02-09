/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        EB_Garamond: ["EB_Garamond", "serif"],
      },
      maxWidth: {
        inputMax: "15rem",
      },
    },
  },
  plugins: [],
};
