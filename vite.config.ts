import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "./environments",
  plugins: [
    vue(),
    //配置electron
    electron({
      entry: "./electron/main.ts",
    }),
    renderer(),
  ],
  build: {
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api/": "http://192.168.30.111:6951/",
    },
  },
});
