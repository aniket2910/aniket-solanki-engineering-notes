// PROMISES
// Run: node playground/run.js JS promises
//
// A promise is an object representing a value that isn't ready yet. It's in one
// of three states: pending -> then either fulfilled (with a value) or rejected
// (with a reason). Once settled, it never changes again.

// --- Creating a promise ---------------------------------------------------
// The executor runs immediately and calls resolve() on success, reject() on failure.
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "User" + id });
      else reject(new Error("invalid id"));
    }, 20);
  });
}

// --- Consuming: then / catch / finally -----------------------------------
fetchUser(1)
  .then((user) => console.log("got user:", user.name)) // runs on fulfill
  .catch((err) => console.error("failed:", err.message)) // runs on reject
  .finally(() => console.log("done (finally always runs)"));

// --- Chaining: each .then returns a NEW promise --------------------------
// Returning a value passes it to the next .then; returning a promise waits for it.
fetchUser(2)
  .then((user) => user.id * 10) // return a plain value
  .then((score) => console.log("chained score:", score)) // 20
  .catch((err) => console.error(err));

// --- Error propagation: one .catch handles any earlier failure -----------
fetchUser(-1)
  .then((user) => console.log("won't run:", user))
  .catch((err) => console.error("caught rejection:", err.message)); // "invalid id"

// --- Combinators ----------------------------------------------------------
const p1 = fetchUser(1);
const p2 = fetchUser(2);
const bad = fetchUser(-5);

// all: wait for every one; reject if ANY rejects
Promise.all([p1, p2]).then((users) =>
  console.log("all:", users.map((u) => u.name).join(", "))
);

// allSettled: wait for every one; never rejects, reports each outcome
Promise.allSettled([p1, bad]).then((results) =>
  console.log("allSettled:", results.map((r) => r.status).join(", ")) // fulfilled, rejected
);

// race: settle with whichever settles FIRST (fulfill or reject)
Promise.race([p1, p2]).then((first) => console.log("race winner:", first.name));

// any: resolve with the first to FULFILL; rejects only if all reject
Promise.any([bad, p2]).then((first) => console.log("any first ok:", first.name));
