// THE `new` KEYWORD + CONSTRUCTOR FUNCTIONS
// Run: node playground/run.js JS new-keyword
//
// `new Fn()` is not "call Fn". It runs a 4-step ritual around the call:
//   1. create a fresh empty object
//   2. link its prototype to Fn.prototype
//   3. bind `this` to that object while Fn runs
//   4. return that object automatically (unless Fn returns its OWN object)

// --- Without new vs with new ---------------------------------------------
// The SAME function behaves completely differently based on the call shape.

function Person(name) {
  this.name = name; // with `new`, this === the fresh object
}

const withNew = new Person("Aniket");
const withoutNew = Person("Aniket"); // plain call

console.log(withNew); // Person { name: 'Aniket' }
console.log(withoutNew); // undefined  -> Person has no explicit return
console.log(withNew instanceof Person); // true
// In strict mode `Person("Aniket")` throws: `this` is undefined, so
// `this.name = ...` blows up. This file is a CommonJS (sloppy) module, so
// `this` is module.exports here and the write silently goes nowhere — which is
// its own bug. Either way, forgetting `new` is broken.

// --- Step 2 proof: the prototype link ------------------------------------
// `new` wires the instance to Person.prototype, so shared methods live in ONE
// place instead of being copied onto every instance.
Person.prototype.greet = function () {
  return "Hi, I am " + this.name;
};

const p = new Person("Sam");
console.log(p.greet()); // "Hi, I am Sam"  -> found via the prototype chain
console.log(Object.getPrototypeOf(p) === Person.prototype); // true

// --- Step 4 gotcha: explicit return overrides ----------------------------
// If the constructor returns an OBJECT, `new` hands back that object instead
// of the freshly created one. If it returns a PRIMITIVE, the return is ignored
// and you still get the new object.

function ReturnsObject() {
  this.a = 1;
  return { b: 2 }; // object wins
}
function ReturnsPrimitive() {
  this.a = 1;
  return 42; // primitive ignored
}

console.log(new ReturnsObject()); // { b: 2 }        -> our object was discarded
console.log(new ReturnsPrimitive()); // ReturnsPrimitive { a: 1 }

// --- Detecting new: new.target -------------------------------------------
// Inside a function, new.target is the function when called with `new`, else
// undefined. This is how you can force correct usage (and how classes do it).
function MustUseNew() {
  if (!new.target) {
    throw new Error("MustUseNew must be called with new");
  }
  this.ok = true;
}

console.log(new MustUseNew()); // MustUseNew { ok: true }
try {
  MustUseNew(); // no new -> new.target is undefined
} catch (err) {
  console.log("caught:", err.message); // caught: MustUseNew must be called with new
}

// --- class is the same machinery, with a guardrail -----------------------
// A class constructor is just a constructor function under the hood — but the
// language throws if you forget `new`, removing the footgun above.
class Animal {
  constructor(species) {
    this.species = species;
  }
}
console.log(new Animal("cat")); // Animal { species: 'cat' }
try {
  // @ts-ignore — intentionally calling without new to show the built-in guard
  Animal("dog");
} catch (err) {
  console.log("caught:", err.message); // Class constructor Animal cannot be invoked without 'new'
}
