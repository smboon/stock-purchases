import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/stock-purchases/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "src/setupTests.js",
  },
});
