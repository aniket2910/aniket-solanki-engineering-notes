// Splits a SQL script into single statements, so each one gets its own result card
// (like psql). Ported from POSTGRES/playground/src/split.js: a semicolon only ends a
// statement when it is outside a string, a -- comment, or a $$ body $$.

export function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];
    const rest = sql.slice(i);

    if (rest.startsWith("--")) {
      const end = sql.indexOf("\n", i);
      const stop = end === -1 ? sql.length : end + 1;
      current += sql.slice(i, stop);
      i = stop;
    } else if (ch === "'") {
      // '' inside a string is an escaped quote, so keep scanning past pairs.
      let j = i + 1;
      while (j < sql.length && !(sql[j] === "'" && sql[j + 1] !== "'")) {
        j += sql[j] === "'" ? 2 : 1;
      }
      current += sql.slice(i, j + 1);
      i = j + 1;
    } else if (ch === "$") {
      const tag = rest.match(/^\$[A-Za-z_]*\$/);
      if (tag) {
        const close = sql.indexOf(tag[0], i + tag[0].length);
        const stop = close === -1 ? sql.length : close + tag[0].length;
        current += sql.slice(i, stop);
        i = stop;
      } else {
        current += ch;
        i++;
      }
    } else if (ch === ";") {
      statements.push(current + ";");
      current = "";
      i++;
    } else {
      current += ch;
      i++;
    }
  }

  if (current.trim()) statements.push(current);
  return statements.map((s) => s.trim()).filter((s) => !isOnlyComments(s));
}

function isOnlyComments(statement: string): boolean {
  return statement
    .split("\n")
    .every((line) => line.trim() === "" || line.trim().startsWith("--"));
}
