// CLOSURES
// Run: node playground/run.js JS closures

// --- 1. The basic idea ----------------------------------------------------
// A closure = a function remembering the variables from where it was created,
// even after that outer function has finished running.

function makeCounter() {
  let count = 0; // this variable lives on because the inner function uses it

  return function () {
    count = count + 1;
    return count;
  };
}

const counter = makeCounter(); // makeCounter has returned, but `count` survives
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// A second counter has its OWN private count — closures don't share state.
const another = makeCounter();
console.log(another()); // 1  (not 4)

// --- 2. Data privacy (the module pattern) --------------------------------
// The only way to touch `balance` is through the methods we return.
// There is no `account.balance` to reach in and change directly.

function createAccount(startingBalance) {
  let balance = startingBalance; // private — not a property on the returned object

  return {
    deposit(amount) {
      balance = balance + amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(100);
console.log(account.deposit(50)); // 150
console.log(account.getBalance()); // 150
console.log(account.balance); // undefined — genuinely private

// --- 3. The classic loop bug (why this is asked constantly) --------------
// With `var`, there is ONE shared variable. All three callbacks close over the
// SAME i, and by the time they run the loop is done and i is 3.

console.log("var (buggy):");
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10); // prints 3, 3, 3
}

// With `let`, each loop iteration gets a NEW binding, so each callback closes
// over its own copy.
setTimeout(() => {
  console.log("let (fixed):");
  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 10); // prints 0, 1, 2
  }
}, 50);
