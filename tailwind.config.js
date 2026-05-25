/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        teachers: ["Teachers-Regular"],
        "teachers-bold": ["Teachers-Bold"],
        "teachers-medium": ["Teachers-Medium"],
        "teachers-semibold": ["Teachers-SemiBold"],

        poppins: ["Poppins-Regular"],
        "poppins-bold": ["Poppins-Bold"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],

        helveticaNeue: ["HelveticaNeue-Medium"],
        "helvetica-bold": ["HelveticaNeue-Bold"],

        sfProDisplay: ["SFProDisplay-Regular"],
        "sfProDisplay-medium": ["SFProDisplay-Medium"],
        "sfProDisplay-semibold": ["SFProDisplay-Semibold"],
        "sfProDisplay-bold": ["SFProDisplay-Bold"],
      },
    },
    screens: {
      sm: "320px",
      md: "480px",
      lg: "640px",
      xl: "720px",
      xxl: "750px",
      xxxl: "1080px",
    },
  },
  plugins: [],
};
