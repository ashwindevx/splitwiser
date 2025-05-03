/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Poppins",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: {
          DEFAULT: "#2E5A9B", // Using the lighter blue as main color for better visibility
          dark: "#003566", // Original main blue becomes dark variant
          light: "#4B7CC7", // Lighter version for contrast on dark backgrounds
        },
        accent: "#FFD60A", // Keeping the vivid yellow as it works well for dark mode
        muted: "#9CA3AF", // Lighter gray for better readability
        background: "#000814", // Using your near-black navy as background
        foreground: "#F8F9FA", // Using your off-white as text color
        border: "#1F2937", // Darker border for separation on dark background
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
