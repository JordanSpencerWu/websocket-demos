module.exports = {
  purge: [['./dist/*.html']],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'green-gecko': 'rgb(var(--green-gecko-rgb))',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
