// Tiny hash router: #/postgres/p/1757 → ["postgres", "p", "1757"], plus ?a=anchor.
// Hash routes survive a refresh and need no server config.

import { useEffect, useState } from "react";

export type Route = { parts: string[]; anchor: string | null };

function parse(): Route {
  const [path, query = ""] = window.location.hash.replace(/^#\/?/, "").split("?");
  return { parts: path.split("/").filter(Boolean), anchor: new URLSearchParams(query).get("a") };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export const href = (...parts: (string | number)[]) => "#/" + parts.join("/");

export function go(...parts: (string | number)[]) {
  window.location.hash = href(...parts);
}
