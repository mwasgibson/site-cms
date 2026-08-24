/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D1220",
        paper: "#F3F5F1",
        surface: "#FFFFFF",
        border: "#DADFD8",
        muted: "#5B6472",
        text: "#10151C",
        signal: {
          DEFAULT: "#E2711D",
          dark: "#9C4A10",
        },
        wire: {
          DEFAULT: "#0F6E5D",
          light: "#E4F1EE",
        },
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionDuration: {
        instant: "150ms",
        fast: "200ms",
        normal: "300ms",
        slow: "500ms",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
