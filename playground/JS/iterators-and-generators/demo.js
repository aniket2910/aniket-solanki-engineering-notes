// ITERATORS & GENERATORS
// Run: node playground/run.js JS iterators-and-generators

// --- 1. What an iterator actually is -------------------------------------
// An iterator is just an object with a next() method that returns
// { value, done }. Nothing magic. Here it is by hand.

function makeCounter(limit) {
  let current = 0;
  return {
    next() {
      if (current < limit) {
        current = current + 1;
        return { value: current, done: false };
      }
      return { value: undefined, done: true };
    },
  };
}

const counter = makeCounter(3);
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }

// --- 2. Generators write that iterator for you ---------------------------
// A generator function (function*) does the exact same thing in far less code.
// `yield` hands a value out and pauses; the next call resumes right after it.

function* countTo(limit) {
  for (let i = 1; i <= limit; i++) {
    yield i; // pause here, give back i, continue on the next pull
  }
}

// A generator works directly with for...of and spread:
console.log([...countTo(3)]); // [1, 2, 3]
for (const n of countTo(3)) {
  process.stdout.write(n + " "); // 1 2 3
}
console.log();

// --- 3. The real win: laziness (infinite sequences) ----------------------
// A generator only computes the next value when asked, so it can be infinite.

function* naturalNumbers() {
  let n = 1;
  while (true) {
    yield n;
    n++;
  }
}

// take() pulls only the first `count` values — the source is never fully run.
function* take(iterable, count) {
  let taken = 0;
  for (const value of iterable) {
    if (taken >= count) return;
    yield value;
    taken++;
  }
}

console.log([...take(naturalNumbers(), 5)]); // [1, 2, 3, 4, 5]

// --- 4. Two-way channel: next(value) feeds a value back in ---------------
// The value you pass to next() becomes the result of the paused `yield`.
// (The first next() just starts the generator, so its argument is ignored.)

function* greeter() {
  const name = yield "What is your name?";
  return "Hello " + name;
}

const g = greeter();
console.log(g.next().value); // "What is your name?"  (start)
console.log(g.next("Aniket")); // { value: "Hello Aniket", done: true }
