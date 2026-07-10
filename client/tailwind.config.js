/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211d",
        muted: "#66706b",
        surface: "#fffdf8",
        brand: "#1e4d3a",
        mint: "#2f7d5d",
        amber: "#a5650b",
        sun: "#f4c95d",
        analytics: "#0d5d86",
        coral: "#c45f4b"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(30, 77, 58, 0.08)"
      }
    }
  },
  plugins: []
};
