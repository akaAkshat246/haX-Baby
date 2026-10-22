import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    include: [
      "three",
      "three/addons/geometries/RoundedBoxGeometry.js",
    ],
  },
  server: {
    port: 3000,
  },
});
