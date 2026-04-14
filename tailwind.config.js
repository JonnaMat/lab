/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dracula: {
          bg: '#282A36',
          'bg-light': '#343746',
          'bg-lighter': '#424450',
          'bg-dark': '#21222C',
          'bg-darker': '#191A21',
          'current-line': '#6272A4',
          selection: '#44475A',
          foreground: '#F8F8F2',
          comment: '#6272A4',
          red: '#FF5555',
          orange: '#FFB86C',
          yellow: '#F1FA8C',
          green: '#50FA7B',
          cyan: '#8BE9FD',
          purple: '#BD93F9',
          pink: '#FF79C6',
          'ui-element': '#343746',
        },
        functional: {
          red: '#DE5735',
          orange: '#A39514',
          green: '#089108',
          cyan: '#0081D6',
          purple: '#815CD6',
        },
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
};
