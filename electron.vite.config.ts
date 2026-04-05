import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
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
