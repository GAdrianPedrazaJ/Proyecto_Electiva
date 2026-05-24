/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(123, 63, 255, 0.95), rgba(14, 165, 233, 0.92))',
      },
    },
  },
  plugins: [],
};
