import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF7F0",
        surface: "#F0EBE1",
        elevated: "#E8DFD2",
        border: "#DDD5C5",
        "border-subtle": "#EAE3D8",
        primary: "#1C1410",
        secondary: "#7A6A58",
        muted: "#A8957A",
        accent: {
          DEFAULT: "#C85C2E",
          hover: "#B04D25",
        },
        success: {
          DEFAULT: "#3D8C5E",
        },
        error: {
          DEFAULT: "#C43835",
        },
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
