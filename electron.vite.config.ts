import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    root: resolve("src/renderer"),
    server: {
      host: "127.0.0.1",
    },
    preview: {
      host: "127.0.0.1",
    },
    build: {
      rollupOptions: {
        input: resolve("src/renderer/index.html"),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
