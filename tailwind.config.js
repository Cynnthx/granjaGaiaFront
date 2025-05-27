/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['mooli', 'mooli'],
      },
      textStroke: {
        '1': '1px',
        '2': '2px',
      },
      colors: {
        casiBlanco: '#E3F3F9', // Casi blanco, celeste muy claro
        fondo: '#938EBA', // Color de fondo. Morado clarito
        celesteClaro: '#B1C4DD', // Celeste claro
        moradoNeutro: '#938EBA', // Morado neutro
        moradoBonito: '#B7A3DE', // Morado bonito
        moradoOscuro: '#73487A', // Morado oscuro

      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-stroke-1': {
          '-webkit-text-stroke': '1px',
        },
        '.text-stroke-2': {
          '-webkit-text-stroke': '2px',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}

