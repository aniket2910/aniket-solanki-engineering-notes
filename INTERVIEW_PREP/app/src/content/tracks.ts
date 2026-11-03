// Every subject the app will cover. A track with `live: false` shows on the home page as
// planned, so the whole roadmap is visible from day one.

export type Track = {
  id: string;
  title: string;
  blurb: string;
  live: boolean;
  /** Where the material for a planned track will come from. */
  source?: string;
};

export const tracks: Track[] = [
  { id: "dsa", title: "DSA", blurb: "Namaste DSA Sheet — 165 problems, with complexity fundamentals first.", live: true },
  { id: "js", title: "JavaScript", blurb: "Closures, event loop, this, promises, prototypes, polyfills.", live: false, source: "Prep Info/js-interview-question-by-namastedev.pdf" },
  { id: "react", title: "React", blurb: "Rendering, reconciliation, hooks, performance, patterns.", live: false, source: "Prep Info/react-75-by-namastedev.pdf, INTERVIEW_PREP/REACTJS" },
  { id: "node", title: "Node.js", blurb: "Event loop, streams, clustering, error handling, security.", live: false, source: "Prep Info/node-50.pdf" },
  { id: "postgres", title: "Postgres & SQL", blurb: "Indexes, transactions, isolation, query plans, SQL 50.", live: false, source: "INTERVIEW_PREP/POSTGRES" },
  { id: "system-design", title: "System Design", blurb: "HLD building blocks and classic designs, LLD and design patterns.", live: false, source: "Prep Info/dive-into-design-patterns-en-demo.pdf" },
  { id: "machine-coding", title: "Machine Coding", blurb: "React and Node machine-coding rounds, timed.", live: false },
  { id: "devops", title: "Docker & Kubernetes", blurb: "Theory: images, layers, pods, services, deployments.", live: false },
];
