import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				download: resolve(__dirname, "download/index.html"),
				playground: resolve(__dirname, "playground/index.html"),
			},
		},
	},
});
