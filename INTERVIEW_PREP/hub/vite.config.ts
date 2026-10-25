import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// The hub reads markdown + seed SQL from the sibling subject folders (../POSTGRES, ...),
// so the dev server must be allowed to serve files one level up.
const interviewPrepRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: { fs: { allow: [interviewPrepRoot] } },
  // PGlite ships its own WASM + data bundle; pre-bundling breaks the asset URLs.
  optimizeDeps: { exclude: ["@electric-sql/pglite"] },
});
