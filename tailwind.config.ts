import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Paletas refinadas para cada nicho
        salon: {
          50: "#FAF7F2",
          100: "#F4ECE2",
          200: "#E8D8C4",
          300: "#D6BEA0",
          400: "#C2A37E",
          500: "#A9855E",
          600: "#8C6A47",
          700: "#6E5034",
          800: "#4F3824",
          900: "#322316",
        },
        barber: {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#5E5E5E",
          600: "#444444",
          700: "#2F2F2F",
          800: "#1C1C1C",
          900: "#111111",
          gold: "#C5A059",
          amber: "#D97706",
        },
        nails: {
          50: "#FDF8F7",
          100: "#FBF0ED",
          200: "#F5DDD7",
          300: "#ECC3B9",
          400: "#E0A395",
          500: "#D17D6C",
          600: "#B75B4A",
          700: "#944436",
          800: "#6F3227",
          900: "#4D211A",
          rose: "#E0A395",
          nude: "#E8D5CE",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

