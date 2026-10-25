import { Marked } from "marked";
import { useEffect, useMemo, useRef } from "react";

/**
 * Renders the notes' markdown. Links between note files are rewritten into hub routes,
 * so "02-basic-joins.md#concept-anti-join" opens that section's concepts, and a link to
 * a problem heading ("…md#1378--replace-…") opens the problem page itself.
 */
const marked = new Marked({
  gfm: true,
  renderer: {
    heading(text: string, level: number, raw: string) {
      return `<h${level} id="${slug(raw)}">${text}</h${level}>`;
    },
    link(link: string, title: string | null | undefined, text: string) {
      const target = rewrite(link);
      if (!target) return `<span class="md-deadlink" title="${link}">${text}</span>`;
      const external = /^https?:/.test(target);
      return `<a href="${target}"${title ? ` title="${title}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
    },
  },
});

function rewrite(link: string): string | null {
  if (/^https?:/.test(link)) return link;
  if (link.startsWith("#")) return null; // in-file anchors to other pages' headings
  const [file, anchor] = link.split("#");
  const section = file.match(/^(\d\d)-[\w-]+\.md$/);
  if (section) {
    const problem = anchor?.match(/^(\d+)--/);
    if (problem) return `#/postgres/p/${problem[1]}`;
    return `#/postgres/section/${section[1]}${anchor ? `?a=${anchor}` : ""}`;
  }
  if (file === "README.md") return "#/postgres/guide";
  return null;
}

export function slug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

export function Markdown({ source, className, anchor }: { source: string; className?: string; anchor?: string | null }) {
  const html = useMemo(() => marked.parse(source) as string, [source]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchor) return;
    // Wait a frame so the page has laid out before jumping to the heading.
    const id = setTimeout(() => ref.current?.querySelector(`#${CSS.escape(anchor)}`)?.scrollIntoView({ block: "start" }), 0);
    return () => clearTimeout(id);
  }, [anchor, html]);

  return <div ref={ref} className={`md ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
