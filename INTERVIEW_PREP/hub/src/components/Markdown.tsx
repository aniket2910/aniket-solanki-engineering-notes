import { Marked, type TokenizerAndRendererExtension } from "marked";
import { useEffect, useMemo, useRef } from "react";

/** Maps a link written in a note to a hub route (or null to render plain text). */
export type LinkResolver = (href: string) => string | null;

/**
 * Renders the notes' markdown. Links between note files are rewritten into hub routes by
 * a per-subject resolver; the default one knows the SQL 50 files, so "02-basic-joins.md
 * #concept-anti-join" opens that section's concepts and "…md#1378--replace-…" opens the
 * problem page itself.
 */
let resolveCurrent: LinkResolver = sql50Links;

const math: TokenizerAndRendererExtension = {
  name: "math",
  level: "inline",
  start: (src) => src.indexOf("$"),
  tokenizer(src) {
    // Pandoc's rule, so "$5 or $10" stays money: the opening $ is followed by a non-space,
    // the closing $ follows a non-space and isn't followed by a digit.
    const m = /^\$(?=\S)([^$\n]*?\S)\$(?!\d)/.exec(src);
    if (m) return { type: "math", raw: m[0], text: m[1] };
    return undefined;
  },
  renderer: (token) => `<span class="math">${texToHtml(token.text as string)}</span>`,
};

const marked = new Marked({
  gfm: true,
  extensions: [math],
  renderer: {
    heading(text: string, level: number, raw: string) {
      return `<h${level} id="${slug(raw)}">${text}</h${level}>`;
    },
    link(link: string, title: string | null | undefined, text: string) {
      const target = resolveCurrent(link);
      if (!target) return `<span class="md-deadlink" title="${link}">${text}</span>`;
      const external = /^https?:/.test(target);
      return `<a href="${target}"${title ? ` title="${title}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
    },
  },
});

function sql50Links(link: string): string | null {
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

// ───────────── a tiny TeX subset: enough for $O(N \log N)$, $\binom{n}{k}$, $2^{n}$ ─────────────

const SYMBOLS: [RegExp, string][] = [
  [/\\log\b/g, "log"],
  [/\\ln\b/g, "ln"],
  [/\\cdot\b/g, "·"],
  [/\\times\b/g, "×"],
  [/\\(le|leq)\b/g, "≤"],
  [/\\(ge|geq)\b/g, "≥"],
  [/\\(ne|neq)\b/g, "≠"],
  [/\\approx\b/g, "≈"],
  [/\\infty\b/g, "∞"],
  [/\\alpha\b/g, "α"],
  [/\\(rightarrow|to)\b/g, "→"],
  [/\\leftarrow\b/g, "←"],
  [/\\lceil\b/g, "⌈"],
  [/\\rceil\b/g, "⌉"],
  [/\\lfloor\b/g, "⌊"],
  [/\\rfloor\b/g, "⌋"],
  [/\\(ldots|dots)\b/g, "…"],
  [/\\pm\b/g, "±"],
  [/\\%/g, "%"],
  [/\\_/g, "_"],
  [/\\\{/g, "{"],
  [/\\\}/g, "}"],
];

function texToHtml(tex: string): string {
  let s = tex.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, "C($1, $2)");
  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)");
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, "√($1)");
  s = s.replace(/\\(text|mathrm|mathbf)\{([^{}]*)\}/g, "$2");
  for (const [re, out] of SYMBOLS) s = s.replace(re, out);
  s = s.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>").replace(/\^([\w∞])/g, "<sup>$1</sup>");
  s = s.replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>").replace(/_([A-Za-z0-9])/g, "<sub>$1</sub>");
  return s.replace(/\\([A-Za-z]+)/g, "$1").replace(/[{}]/g, "");
}

export function slug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

export function Markdown({
  source,
  className,
  anchor,
  resolveLink = sql50Links,
}: {
  source: string;
  className?: string;
  anchor?: string | null;
  resolveLink?: LinkResolver;
}) {
  const html = useMemo(() => {
    // marked.parse is synchronous, so the resolver only needs to be set for this call.
    resolveCurrent = resolveLink;
    try {
      return marked.parse(source) as string;
    } finally {
      resolveCurrent = sql50Links;
    }
  }, [source, resolveLink]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchor) return;
    // Wait a frame so the page has laid out before jumping to the heading.
    const id = setTimeout(() => ref.current?.querySelector(`#${CSS.escape(anchor)}`)?.scrollIntoView({ block: "start" }), 0);
    return () => clearTimeout(id);
  }, [anchor, html]);

  return <div ref={ref} className={`md ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
