/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dracula'] // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
	}
};
