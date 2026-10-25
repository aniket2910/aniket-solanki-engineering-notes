import { useSyncExternalStore } from "react";

const query = () => window.matchMedia("(prefers-color-scheme: dark)");

export function useColorScheme(): "dark" | "light" {
  return useSyncExternalStore(
    (cb) => {
      const mq = query();
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => (query().matches ? "dark" : "light"),
  );
}
