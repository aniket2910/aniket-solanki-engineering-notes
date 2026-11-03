import { CheatSheetPage } from "./pages/CheatSheetPage.tsx";
import { ConceptPage } from "./pages/ConceptPage.tsx";
import { DsaPage } from "./pages/DsaPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { ProblemPage } from "./pages/ProblemPage.tsx";
import { setMode, useMode } from "./lib/mode.ts";
import { href, useRoute } from "./lib/router.ts";
import { useTheme } from "./lib/theme.ts";
import { streaks, useProgress } from "./lib/progress.ts";

function Page({ route }: { route: string[] }) {
  const [track, a, b] = route;
  if (!track) return <HomePage />;
  if (track === "dsa") {
    if (!a) return <DsaPage />;
    if (a === "cheatsheet") return <CheatSheetPage />;
    if (a === "concept" && b) return <ConceptPage slug={b} />;
    return <ProblemPage slug={a} />;
  }
  return (
    <div className="page narrow">
      <h1>Coming soon</h1>
      <p className="muted">This track is planned. <a href={href()}>Back home</a></p>
    </div>
  );
}

export function App() {
  const route = useRoute();
  const [theme, toggleTheme] = useTheme();
  const mode = useMode();
  const { current } = streaks(useProgress().days);

  return (
    <>
      <header className="topbar">
        <a className="brand" href={href()}>
          <span className="brand-mark">R</span> Revise
        </a>
        <nav className="topnav">
          <a className={route[0] === "dsa" ? "is-active" : ""} href={href("dsa")}>DSA</a>
        </nav>
        <span className="topbar-spacer" />
        <div className="mode" role="group" aria-label="Mode">
          <button className={mode === "practice" ? "is-active" : ""} onClick={() => setMode("practice")} title="Answers hidden until you reveal them">
            Practice
          </button>
          <button className={mode === "revise" ? "is-active" : ""} onClick={() => setMode("revise")} title="Everything open, for fast reading">
            Revise
          </button>
        </div>
        <span className="streak" title="Day streak">🔥 {current}</span>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </header>
      <main>
        <Page route={route} />
      </main>
    </>
  );
}
