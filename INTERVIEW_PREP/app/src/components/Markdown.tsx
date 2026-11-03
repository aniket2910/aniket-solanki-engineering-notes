import { marked } from "marked";
import { useMemo } from "react";

marked.use({ gfm: true });

/** Renders this app's own authored markdown (never user input). */
export function Markdown({ text, inline = false }: { text: string; inline?: boolean }) {
  const html = useMemo(() => (inline ? marked.parseInline(text) : marked.parse(text)) as string, [text, inline]);
  return inline ? <span className="md" dangerouslySetInnerHTML={{ __html: html }} /> : <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}
