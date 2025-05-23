/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: "#588157",
        forestGreen: "#344e41",
        primary: "#436755",
        secondary: "#A3B18A",
        accent: "#F77F00",
      },
      textColor: {
        DEFAULT: "#18181b",
      },
      fontFamily: {
        sans: ["Funnel Sans", "ui-sans-serif", "system-ui"],
        lexend: ["Lexend", "ui-sans-serif", "system-ui"],
        milanello: ["Milanello", "sans-serif"],
        serif: ["Playfair Display", "ui-serif"], // Default serif font
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular"], // Default monospace font
      },
      letterSpacing: {
        tightest: "-.05em",
        extraWide: ".3em",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
