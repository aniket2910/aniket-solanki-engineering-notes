// The iterable protocol — what makes `for...of` and spread work on YOUR object.
//
// Iterator  = has .next()            (the cursor that produces values)
// Iterable  = has [Symbol.iterator]()  that RETURNS an iterator
//
// Arrays, strings, Maps, Sets are built-in iterables. A plain object is NOT —
// that's why `for (const x of {})` throws. You opt in by adding [Symbol.iterator].

/**
 * A range that knows how to iterate itself. Implementing [Symbol.iterator]
 * is the single hook that unlocks for...of, spread, and destructuring.
 */
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  // The well-known symbol the language looks for. Returning a fresh iterator
  // each call is what lets the SAME range be looped multiple times independently.
  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;

    return {
      next() {
        if (current < end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

// const range = new Range(0, 10, 2);

// // for...of asks the object for [Symbol.iterator](), then calls .next() until done
// console.log(range); // [0, 2, 4, 6, 8]   — spread consumes the iterable

// for (const n of range) {
//   console.log(n + " "); // 0 2 4 6 8   — fresh iterator, independent walk
// }
// console.log();

// const [first, second] = range; // destructuring also speaks the iterable protocol
// console.log({ first, second }); // { first: 0, second: 2 }

// Run: node playground/iterators-generators/02-iterable-protocol.js

function Run () {
  console.log(this)

  this.name = "Aniket"
  console.log(this)
}

function Stop () {
  console.log(this)
}

function run () {
  console.log(`Inside run()`,this)
}

// run()

// const x = new Run()
// const sx = new Stop()
// console.log(sx)

// console.log(x, this, x.name)

const obj = {
  _name: "Aniket",
  get name() {
    console.log("Getter is called")
    return this._name
  }, 
  set name(newName) {
    console.log("Setter is called")
    this._name = newName
  },
  _age: 27, 
  get age() {
    return this._age
  },
  set age(newAge) {
    this._age = newAge
  }
}

// console.log(obj.name)
// obj.name = "Aniket Solanki"
// console.log(obj.name)


// setTimeout(() => console.log('setTimeout'), 0);
// process.nextTick(() => console.log('nextTick'));


class Singleton {
  constructor() {
    // if (!Singleton.instance) {
    //   Singleton.instance = this
    // }
    // return Singleton.instance
  }
}

const x1 = new Singleton();
const x2 = new Singleton();

console.log(x1 === x2)