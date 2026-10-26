import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// The hub reads markdown + seed SQL from the subject folders: INTERVIEW_PREP/POSTGRES and
// the repo-root DSA/ notebook. So the dev server must be allowed to serve the repo root.
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const noteDirs = [fileURLToPath(new URL("../../DSA", import.meta.url)), fileURLToPath(new URL("../POSTGRES", import.meta.url))];

/**
 * Vite only watches its own folder for new files, so a note added to DSA/ after the dev
 * server started would never reach import.meta.glob. Watch the note folders too, and
 * reload when a note appears or disappears (edits to existing notes already hot-reload).
 */
function watchNotes(): Plugin {
  return {
    name: "watch-notes",
    configureServer(server) {
      server.watcher.add(noteDirs);
      const onAddOrRemove = (file: string) => {
        if (!file.endsWith(".md") || !noteDirs.some((d) => file.startsWith(d))) return;
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onAddOrRemove);
      server.watcher.on("unlink", onAddOrRemove);
    },
  };
}

export default defineConfig({
  plugins: [react(), watchNotes()],
  server: { fs: { allow: [repoRoot] } },
  // PGlite ships its own WASM + data bundle; pre-bundling breaks the asset URLs.
  optimizeDeps: { exclude: ["@electric-sql/pglite"] },
});
