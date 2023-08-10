module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        sm: "0.4rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    screens: {
      sm: "300px",
      md: "600px",
      lg: "1440px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        dominant: "#FFF",
        complement: "#F4F4F4",
        "ascent-1": "#E31E25",
        "ascent-2": "#3A3285",
        "ascent-3": "#CBC5FF",
      },
    },
  },
  plugins: [],
};
