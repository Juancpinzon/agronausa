export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A1F",
        accent: "#C4853A",
        bg: "#F9F6F0",
        surface: "#FFFFFF",
        border: "#DDD5C8",
        text: "#2C1A0E",
        "text-muted": "#7A6553",
        success: "#3A7D44",
        error: "#C0392B",
        warning: "#E67E22",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        ui: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
