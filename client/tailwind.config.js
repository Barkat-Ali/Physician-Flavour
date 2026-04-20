/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Arial", "Helvetica", "sans-serif"],
        body: ["Arial", "Helvetica", "sans-serif"]
      },
      colors: {
        bgBeige: "#f5f5dc",
        navGreen: "rgb(50, 109, 75)",
        navLime: "rgb(128, 216, 55)",
        headingGreen: "rgb(68, 255, 0)",
        buttonGreen: "#4CAF50",
        hoverLime: "rgb(149, 223, 87)",
        activeDark: "rgb(66, 140, 6)"
      },
      boxShadow: {
        glow: "0 10px 35px rgba(76, 175, 80, 0.25)"
      }
    }
  },
  plugins: []
};
