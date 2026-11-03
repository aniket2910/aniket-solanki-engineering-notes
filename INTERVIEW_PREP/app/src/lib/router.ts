// Hash routing (#/dsa/binary-search), so the static build works on any host without rewrites.

import { useSyncExternalStore } from "react";

const read = () => window.location.hash.replace(/^#\/?/, "").split("?")[0];

export function useRoute(): string[] {
  const path = useSyncExternalStore(
    (cb) => {
      window.addEventListener("hashchange", cb);
      return () => window.removeEventListener("hashchange", cb);
    },
    read,
  );
  return path.split("/").filter(Boolean);
}

export const href = (...parts: string[]) => `#/${parts.join("/")}`;

export function go(...parts: string[]) {
  window.location.hash = href(...parts);
}
