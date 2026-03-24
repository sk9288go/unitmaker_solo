import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        secondary: '#4B5563',
        'brand-yellow': '#feb83f',
        'brand-black': '#222',
      },
    },
  },
  plugins: [],
};

export default config;
