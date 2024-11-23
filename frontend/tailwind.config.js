/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      azeret: ['"Azeret Mono"', "monospace"],
    },
    screens: {
      sm: "375px", // Mobile
      md: "1024px", // Tablet
      lg: "1025px", // Desktop
    },
    extend: {
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translate3d(0, 100%, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-left": {
          "0%": {
            opacity: 0,
            transform: "translate3d(-100%, 0, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-left": "fade-in-left 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
