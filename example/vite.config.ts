import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // alias @lib to ../src (your library source)
      "@lib": resolve(__dirname, "../src/"),
    },
  },
});
