import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base + hash routing: the build works from any folder or static host
// (nginx in Docker, GitHub Pages, Netlify) without server rewrites.
export default defineConfig({
  base: "./",
  plugins: [react()],
  worker: { format: "es" },
  // CodeMirror is most of the bundle; one chunk is fine for a study app.
  build: { chunkSizeWarningLimit: 1200 },
});
