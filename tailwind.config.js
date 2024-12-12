/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcol: "#36454F", //carbón
        venetian: "#C80815", //rojo
        azul: "#2d4059", // ó FF5733
        mandarin: "#F37A22", //naranja
        rojoCoral: "#EA5455", //rojo + naranja = rojo coral
        darkGray: "#2F2F2F",
        text1: "#828282",
        bgGray: "#EFEDED",
        bgCrema: "#F8F4F4",
        bgLightBlue: "#6f86af", //azul cobalto crema
        bgYankBlue: "#162749", //Yankees Blue ó Deep Blue
        badgeGreen: "#95FF95", //verde pastel
        badgeOrange: "#F59A6C", //narajna pastel
        nuevoBdg: "#20C997", //Nuevo verde
        abiertoBdg: "#C7291D", //Abierto rojo
        cursoBdg: "#DF2A2A", //En curso rojo claro
        pendienteBdg: "#2F91EC", //Pendiente azul
        resueltoBdg: "#88929C", //Resuelto gris
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        crimson: ['Crimson Pro', 'sans-serif']
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "cupcake"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    // darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
