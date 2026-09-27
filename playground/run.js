// Tiny topic runner — so you can list and switch topics without remembering paths.
//
// Usage:
//   node playground/run.js                 -> list all subjects
//   node playground/run.js JS              -> list all topics under JS
//   node playground/run.js JS closures     -> run playground/JS/closures/demo.js
//
// Convention: playground/<SUBJECT>/<topic>/demo.js is the runnable file.
// Add a new topic = add a folder with a demo.js. Nothing here needs editing.

const fs = require("fs");
const path = require("path");

const root = __dirname;

// A directory is a "subject" if it holds topic folders (JS, SQL, NODEJS, ...).
function listSubjects() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

// A topic is a folder that contains a demo.js we can run.
function listTopics(subject) {
  const subjectDir = path.join(root, subject);
  return fs
    .readdirSync(subjectDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(subjectDir, entry.name, "demo.js")))
    .map((entry) => entry.name);
}

const [subject, topic] = process.argv.slice(2);

if (!subject) {
  console.log("Subjects:", listSubjects().join(", "));
  console.log("Try: node playground/run.js JS");
} else if (!topic) {
  console.log(`${subject} topics:`);
  for (const name of listTopics(subject)) console.log("  -", name);
  console.log(`Try: node playground/run.js ${subject} ${listTopics(subject)[0] || "<topic>"}`);
} else {
  const demoPath = path.join(root, subject, topic, "demo.js");
  if (!fs.existsSync(demoPath)) {
    console.error(`No demo found at ${subject}/${topic}/demo.js`);
    process.exit(1);
  }
  require(demoPath); // running the file executes its console.logs
}
