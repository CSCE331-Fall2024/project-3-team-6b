/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'panda-red': 'var(--panda-red)',
        'panda-dark-red': 'var(--panda-dark-red)',
        'panda-gold': 'var(--panda-gold)',
        'panda-light-gold': 'var(--panda-light-gold)',
        'panda-cream': 'var(--panda-cream)',
      },
    },
  },
  plugins: [],
}