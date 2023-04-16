/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		colors: {
			primary: "#F2E9E4",
			primaryLight: "#FFFEFC",
			primaryDark: "#B9ADA7",
			secondary: "#22223B",
			secondaryLight: "#4A4E69",
			secondaryDark: "#18181a",
			tertiary: "#9A8C98",
			tertiaryLight: "#C9ADA7",
		},
		fontFamily: {
			sans: ["Poppins", "sans-serif"],
		},
	},
	plugins: [],
};
