/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: "#588157",
        forestGreen: "#344e41",
      },
      textColor: {
        DEFAULT: "#18181b",
      },
      fontFamily: {
        sans: ["Funnel Sans", "ui-sans-serif", "system-ui"],
        lexend: ["Roboto", "ui-sans-serif", "system-ui"],
        serif: ["Playfair Display", "ui-serif"], // Default serif font
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular"], // Default monospace font
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
};
