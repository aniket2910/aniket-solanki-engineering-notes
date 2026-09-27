// THE `this` KEYWORD
// Run: node playground/run.js JS this-keyword
//
// `this` is decided by HOW a function is called, not where it is defined.
// There are four rules. Arrow functions ignore all of them and use the `this`
// of wherever they were written.

// --- Rule 1: implicit binding (called as obj.method()) -------------------
// `this` is the object left of the dot at call time.

const user = {
  name: "Aniket",
  greet() {
    return "Hi, I am " + this.name;
  },
};
console.log(user.greet()); // "Hi, I am Aniket"  -> this === user

// --- The "lost this" problem ---------------------------------------------
// Pull the method into a plain variable and the dot is gone, so the implicit
// binding is lost. Calling it now uses default binding (this is not user).
// This is exactly what happens when you pass user.greet to setTimeout or an
// event listener — they call it as a plain function later.
const greetPlainly = user.greet;
console.log(greetPlainly()); // "Hi, I am undefined"  -> this is no longer user

// --- Rule 3: explicit binding (call / apply / bind) ----------------------
// Force `this` yourself. bind returns a NEW function permanently tied to user.
const boundGreet = user.greet.bind(user);
console.log(boundGreet()); // "Hi, I am Aniket"

// --- Arrow functions: lexical this ---------------------------------------
// An arrow has no `this` of its own — it uses the `this` of the surrounding
// scope. Inside a method, that surrounding `this` is the object, so the arrow
// callback keeps working where a normal function would lose it.

const team = {
  name: "Platform",
  members: ["a", "b"],
  listMembers() {
    // forEach's callback is called as a plain function; a normal function here
    // would have the wrong `this`. The arrow inherits listMembers's `this`.
    return this.members.map((m) => this.name + ":" + m);
  },
};
console.log(team.listMembers()); // ["Platform:a", "Platform:b"]

// --- Rule 4: new binding -------------------------------------------------
// Calling with `new` creates a fresh object and points `this` at it.
function Person(name) {
  this.name = name; // this === the new object
}
const p = new Person("Sam");
console.log(p.name); // "Sam"
