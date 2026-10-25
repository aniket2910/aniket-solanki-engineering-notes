import type { ReactNode } from "react";

export function Placeholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="page page--narrow">
      <p className="eyebrow">Coming soon</p>
      <h1>{title}</h1>
      <div className="md">{children}</div>
    </div>
  );
}
