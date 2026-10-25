# The Relational Model — Why Every Database Looks Like a Table

## 🎯 The Core Question

When you write `SELECT name FROM customers WHERE city = 'Pune'`, you never say *how* to find those
rows. You don't say which file to open, which disk block to read first, or whether to use an index.
You describe the answer you want and the database works out how to get it. Why is that possible,
and why does almost every serious database store data as tables? Neither was obvious. Before 1970
it worked the other way round, and one mathematician's paper changed it.

---

## 📜 The Origin Story

### The world before: data as a map you had to walk

In the 1950s and early 1960s business data lived in **files** on magnetic tape and, later, disk.
Each program defined its own record layout. A payroll program knew that bytes 1–20 were the name and
bytes 21–28 were the salary. To answer a question you wrote a program that read the file record by
record. A new question meant a new program, and changing the file layout meant fixing every program
that read it.

The first real **database management systems** appeared in the 1960s, and they took a *navigational*
approach.

- **The network model.** Charles Bachman designed the **Integrated Data Store (IDS)** at General
  Electric in the early 1960s. Records were linked by stored **pointers**. A customer record pointed
  to its first order, that order pointed to the next order, and so on, forming chains. The CODASYL
  committee (the same body that standardised COBOL) later turned this style into a standard through
  its Data Base Task Group, whose reports came out around 1969–1971. Bachman received the Turing Award
  in 1973. His lecture was titled *"The Programmer as Navigator"*, which describes the style exactly:
  the programmer steers through the data, record by record, following pointers.
- **The hierarchical model.** IBM's **IMS (Information Management System)** came out in the late
  1960s. It is commonly associated with tracking the huge bill of materials for the Apollo programme.
  IMS stored data as trees: a parent segment owned child segments, which owned their own children.

Both models were efficient for the access pattern they were built around. Both had the same deep
flaw: **the program's code was written against the physical structure of the data.** To find a
customer's orders you started at the customer record and followed its order chain. Now suppose
someone asked the reverse question, "which customers ever bought product X?" If the pointers ran from
customer to order, and not from product to order, there was no cheap path. You either scanned
everything or the database administrator restructured the database, which then broke the programs
written against the old structure.

### The person and the problem he was staring at

**Edgar F. Codd** ("Ted" to colleagues) was a British-born mathematician who had studied at Oxford
and worked for IBM for most of his career. By the late 1960s he was at IBM's research laboratory in
San Jose, California, looking at the database systems of the day with a mathematician's eye. What
bothered him was not speed. It was that **users and programs depended on how data happened to be
stored.**

In 1969 he wrote an internal IBM research report on the idea. In June 1970 he published the public
version in *Communications of the ACM*: **"A Relational Model of Data for Large Shared Data Banks."**
The paper opens with a goal that sounds modest today and was radical then. Users of a large data bank
should be protected from having to know how the data is organised inside the machine.

Codd named three kinds of dependence that existing systems forced on programs:

1. **Ordering dependence.** Programs assumed records came back in the order they were stored. Change
   the storage order and the program silently gives wrong results.
2. **Indexing dependence.** Programs referred to specific indexes by name. Drop or add an index for
   performance and programs break.
3. **Access path dependence.** Programs followed specific pointer paths (the network and tree links
   above). Restructure the paths and every program that walked them must be rewritten.

His goal had a name: **data independence**. The way data is physically stored should be able to
change without the programs that use it noticing.

### The leap: borrow from mathematics, not from hardware

Codd's insight was to stop modelling data on the machine, with its records, pointers and blocks, and
start from a structure mathematicians had understood for decades: the **relation** from set theory.

In mathematics, given sets D₁, D₂, …, Dₙ (Codd called them **domains**, the sets of allowed values),
a relation is simply **a set of n-tuples** where each tuple takes its first value from D₁, its second
from D₂, and so on. Formally, it is a subset of the Cartesian product D₁ × D₂ × … × Dₙ. A table of
customers is exactly that: a set of (id, name, city) tuples.

Three consequences followed:

- **Relationships are values, not pointers.** An order does not *point to* its customer. It *contains
  the customer's id*. Connecting orders to customers means matching equal values. Because the
  connection lives in the data itself, you can follow it in any direction, so "customer → orders" and
  "product → customers" are equally easy to ask.
- **Questions become logic.** Because data is sets of tuples, a question is a statement in
  **first-order predicate logic**: "give me every tuple *c* in customers such that *c.city* = 'Pune'."
  You describe *what* qualifies, not *how* to fetch it. That makes the query **declarative**.
- **A small algebra closes the loop.** Codd defined a handful of operations (selection, projection,
  product, union, difference and others) that take relations in and give relations out. Any question
  can be built by composing them. In a 1972 paper, *"Relational Completeness of Data Base
  Sublanguages,"* he showed that this **relational algebra** and the logic-based **relational calculus**
  can express exactly the same queries. That result is now known as Codd's theorem. It is why a
  system can accept a declarative description (calculus-like, as in SQL) and execute it as a sequence
  of operations (algebra-like, as in a query plan).

The 1970 paper also introduced **normalisation**. Codd argued for eliminating "non-simple domains",
meaning values that are themselves lists or nested records, so that every value in a table is atomic.
That idea became **first normal form**. Codd defined further normal forms (2NF, 3NF) in the following
years. Normalisation gets its own lesson later in this track.

### The fight, and proof by construction

The idea was not welcomed everywhere. IBM had a successful product in IMS, and many engineers
believed a system that *figured out the access path for you* could never be as fast as a programmer
who hand-coded pointer navigation. In 1974, at an ACM workshop, Codd and Bachman's camp held a
well-known public debate over relational versus network databases (later written up as "the Great
Debate"). It did not settle anything. What settled it was people **building** relational systems.

- **System R (IBM San Jose, from about 1974).** An IBM research team set out to prove a relational
  system could be practical. Donald Chamberlin and Raymond Boyce designed a query language for it
  called **SEQUEL** ("Structured English Query Language"). It was later renamed **SQL**, reportedly
  because of a trademark conflict. System R also produced the **cost-based query optimizer** (Patricia
  Selinger and colleagues, 1979). The optimizer estimates the cost of different ways to run a query
  and picks the cheapest. That piece answered the "it will be too slow" objection, and Postgres still
  works this way today.
- **Ingres (UC Berkeley, from about 1973).** Michael Stonebraker and Eugene Wong, after reading Codd's
  paper, built a relational system at Berkeley with its own language, **QUEL**. Ingres trained a
  generation of database engineers. Its code and alumni seeded several commercial products.
- **Commercial SQL.** A small company founded by Larry Ellison and colleagues (later renamed Oracle)
  released Oracle Version 2 in 1979. It is widely cited as the first commercially available SQL
  relational database. IBM followed with SQL/DS (1981) and DB2 (1983). SQL became an ANSI standard in
  1986 and an ISO standard in 1987.

Codd received the **Turing Award in 1981** for the relational model. Stonebraker received it in
2014, and his next project after Ingres was called **Postgres**: literally "post-Ingres". That is the
lineage of the database this track is about, and the next lesson follows it.

One more thing worth knowing from the start: **SQL is not a perfect implementation of Codd's model.**
SQL tables allow duplicate rows, columns have a fixed order, and NULL behaves in ways many find
surprising. Codd himself criticised SQL's departures from the model in his later writing. Whenever a
SQL behaviour seems odd, it is usually one of these departures. This lesson points them out as they
come up.

---

## 🩹 Why It Exists (the pain it solves)

Put the history together and the relational model removes four concrete pains:

1. **Programs broke when storage changed.** With data independence you can add an index, reorder a
   table on disk, or split a table across files, and every existing query still returns the same
   answer. Only its speed changes.
2. **New questions needed new programs.** A declarative language lets anyone write an **ad-hoc
   query**: one nobody planned for when the database was designed. In the navigational world, a new
   question could mean a new access path and a new program.
3. **Relationships only worked in one direction.** Pointers have a direction. Matching values does
   not, so every relationship can be queried from either side.
4. **Integrity was the application's job.** With keys and constraints defined on relations, the
   database itself can refuse bad data, such as a duplicate row or an order for a customer who doesn't
   exist, no matter which program tries to write it.

Without the relational model, every query is a small program that knows the physical layout of the
data. That is exactly what "navigational" means.

---

## 🧩 What It Is

**Definition.** The relational model represents all data as **relations**: named sets of tuples,
where every tuple has the same named attributes and each attribute takes atomic values from a
declared domain. You manipulate relations only through operations that take relations as input and
produce relations as output, and constraints (keys) define which relations are valid.

The vocabulary, and what each term is called in SQL and in Postgres:

| Relational theory | SQL / everyday | What it means |
|---|---|---|
| Relation | Table | A set of tuples sharing one structure |
| Tuple | Row | One fact: "customer 1 is Asha, in Bengaluru" |
| Attribute | Column | A named slot every tuple has |
| Domain | Data type (+ constraints) | The set of allowed values for an attribute |
| Relation schema | `CREATE TABLE` definition | Relation name + its attributes and domains |
| Candidate / primary key | `PRIMARY KEY`, `UNIQUE` | Attributes whose values identify a tuple uniquely |
| Foreign key | `REFERENCES` | Attribute whose values must match a key in another relation |
| Relational algebra expression | Query / query plan | A composition of operators that yields a relation |

Postgres still uses Codd's vocabulary internally. Its catalog of tables is called `pg_class`, and
every table, index and view is a "relation" there. When you mistype a table name, the error reads
`relation "custmers" does not exist`.

**Mental model.** A relation is a **set of facts with the same shape**. Each row is a true sentence
("Asha lives in Bengaluru"). The table is the collection of all such true sentences. A query is a
**logical question about those facts**, and its answer is itself a set of facts with a shape, which
is just another relation.

**Real-world analogy: the treasure map vs the librarian.**

- **Navigational database = a treasure map.** "Start at the old oak, walk ten paces north, turn left
  at the well." The directions only work while the oak and the well stay put. If someone moves the
  well, the map is useless. That is access-path dependence: your program (the map) encodes the
  physical layout (the landmarks).
- **Relational database = asking a librarian.** You hand over a card: "every book by Tolkien published
  before 1960." You don't say which aisle to walk. The librarian decides whether to sweep the shelves
  or use the card catalogue. If the library reorganises its shelves overnight, your card still works
  tomorrow.

How the analogy maps:

| Library | Database |
|---|---|
| Your request card | The SQL query (declarative: *what*, not *how*) |
| The librarian deciding how to search | The query optimizer choosing a plan |
| The card catalogue | An index (an optional shortcut, never required for correctness) |
| Reorganising the shelves | Changing physical storage, which never changes the answer |
| "Every book is on exactly one catalogue card" | Keys: each fact is identifiable and recorded once |

---

## ⚙️ How It Works (under the hood)

### 1. A relation is a set, and that one word has consequences

Take two small relations:

```
customers                         orders
+----+-------+-----------+        +----------+-------------+-----------+
| id | name  | city      |        | order_id | customer_id | status    |
+----+-------+-----------+        +----------+-------------+-----------+
|  1 | Asha  | Bengaluru |        |      101 |           1 | shipped   |
|  2 | Rahul | Mumbai    |        |      102 |           1 | paid      |
|  3 | Kabir | NULL      |        |      103 |           2 | cancelled |
+----+-------+-----------+        +----------+-------------+-----------+
```

Because a relation is a **set** of tuples:

- **No order.** The rows have no "first" row. Drawing them top to bottom is only a convenience for
  printing. This is ordering independence: the database may store and return rows in any order, so a
  query that needs an order must say so (`ORDER BY`). Postgres really does return rows in different
  orders depending on the plan it picks, so relying on "the order it came back in" is a genuine bug.
- **No duplicates.** A set cannot contain the same element twice, so two identical tuples are one
  fact, not two. (SQL departs from this; see section 5.)
- **Attributes are named, not positioned.** You refer to `city`, not "the third column".
- **Values are atomic** (first normal form). `city` holds one city, not a list of cities.

Notice `orders.customer_id`. It holds the *value* 1, not a pointer to Asha's record. That value is
the whole relationship.

### 2. The operators: small machines that take tables and give tables

Codd's algebra has a small set of primitive operators. Every other operator can be built from them.

**Selection, σ (sigma): keep rows that satisfy a condition.** It cuts the table horizontally.

```
σ city = 'Bengaluru' (customers)

+----+------+-----------+
| id | name | city      |
+----+------+-----------+
|  1 | Asha | Bengaluru |
+----+------+-----------+
```

**Projection, π (pi): keep only some attributes.** It cuts vertically. Because the result is a set,
duplicates collapse:

```
π customer_id (orders)

+-------------+
| customer_id |      three input rows (1, 1, 2) → two result tuples,
+-------------+      because {1, 1, 2} as a set is {1, 2}
|           1 |
|           2 |
+-------------+
```

**Cartesian product, ×: pair every tuple of A with every tuple of B.** 3 customers × 3 orders = 9
tuples. Most are nonsense ("Kabir" paired with "order 101"), but the product is the raw material for
joins.

**Union, ∪, and difference, −: ordinary set operations.** They require both inputs to have the same
attributes (the relations must be *union-compatible*). A ∪ B is every tuple in either. A − B is every
tuple in A that is not in B.

**Rename, ρ (rho): rename an attribute.** It sounds trivial, but union and difference need matching
attribute names, and a product of a relation with itself needs distinct names. Rename is what makes
that possible.

**Derived operators**, built from the primitives:

- **Join, ⋈:** a product followed by a selection on matching values. `customers ⋈ (id = customer_id) orders`
  means "pair every customer with every order, keep only the pairs where the ids match". The product
  is never actually built in practice (section 4 explains why), but this is what a join *means*.
- **Intersection, ∩:** A ∩ B = A − (A − B).
- **Division, ÷:** answers "for all" questions, such as "customers who bought *every* electronics
  product". It is built from product and difference, and the exercise at the end asks you to write it.

### 3. Closure: why the operators compose

Every operator takes relations and returns a relation. Mathematicians call this **closure**: the
algebra never leaves its own world. Because of it, the output of any operator can be the input of
another, and a whole query is a **tree of operators**:

```
"Names of customers with a shipped order"

              π name
                │
         σ status = 'shipped'
                │
        ⋈ id = customer_id
          ┌─────┴─────┐
     customers      orders
```

Read the tree bottom-up: join the two relations, keep the shipped pairs, keep only the name. This
tree is what `EXPLAIN` shows you in Postgres. A query plan is a relational algebra tree with a
concrete algorithm attached to each node.

### 4. Declarative in, algebra out, and the freedom that gives the optimizer

You write SQL, which is close to the relational *calculus*: a description of the result. The database
translates it into an algebra tree. Codd's theorem guarantees the translation is always possible.
Here is the important part: **many different trees produce the same relation**, and the database is
free to pick any of them.

Two classic equivalences:

```
σ status='shipped' (customers ⋈ orders)   ≡   customers ⋈ (σ status='shipped' (orders))
```

Filtering after the join gives the same answer as filtering `orders` first and joining the smaller
result. The second is far cheaper because the join has less input. This rewrite is called **predicate
pushdown**, and every relational optimizer does it.

```
A ⋈ B   ≡   B ⋈ A
```

Join order doesn't change the answer, but it can change the cost enormously. Picking the order is a
large part of what System R's optimizer, and Postgres's planner after it, does.

The *algorithm* for each node is also free to change. The definition of join says "product, then
select", but no real database builds the full product. It might use a **nested loop** (for each
customer, look up matching orders, ideally through an index), a **hash join** (build a hash table on
one side, probe it with the other), or a **merge join** (sort both sides by the key and walk them
together). All three produce the identical relation. This is data independence in action: the
*meaning* is fixed by the algebra, and the *method* is an implementation detail the optimizer chooses
using statistics about the data.

### 5. Keys, integrity, and NULL

**Keys.** Since a relation is a set, every tuple is distinct, so some set of attributes must identify
each one. A **candidate key** is a minimal such set. You pick one as the **primary key**. A **foreign
key** is an attribute whose values must appear as a key in another relation (`orders.customer_id`
must match some `customers.id`). Two integrity rules follow:

- **Entity integrity:** a primary key value cannot be missing (NULL). You can't identify a fact by an
  unknown.
- **Referential integrity:** every foreign key value must match an existing key, so there are no
  orders for customers who don't exist.

The database enforces both on every write, from every program. In the navigational world that check
lived (or didn't) in each application.

**NULL and three-valued logic.** Real data has gaps. Kabir's city is unknown. Codd introduced a
marker for "value unknown", which SQL calls `NULL`. NULL is *not* a value like `''` or `0`. It means
"unknown", and that forces logic to have three truth values: TRUE, FALSE and **UNKNOWN**.

```
city = 'Mumbai'   when city is NULL  →  UNKNOWN   (is an unknown city Mumbai? unknown)
city <> 'Mumbai'  when city is NULL  →  UNKNOWN   (is it not Mumbai? also unknown)

AND     | TRUE     FALSE   UNKNOWN          OR      | TRUE   FALSE    UNKNOWN
--------+--------------------------         --------+------------------------
TRUE    | TRUE     FALSE   UNKNOWN          TRUE    | TRUE   TRUE     TRUE
FALSE   | FALSE    FALSE   FALSE            FALSE   | TRUE   FALSE    UNKNOWN
UNKNOWN | UNKNOWN  FALSE   UNKNOWN          UNKNOWN | TRUE   UNKNOWN  UNKNOWN
```

A `WHERE` clause keeps a row only when the condition is **TRUE**. UNKNOWN is discarded just like
FALSE. So Kabir appears in *neither* `WHERE city = 'Mumbai'` *nor* `WHERE city <> 'Mumbai'`, which
surprises nearly everyone the first time. To ask about unknowns you must say `IS NULL` or
`IS NOT NULL`. (`NULL = NULL` is also UNKNOWN, not TRUE, because two unknowns are not known to be
equal.)

### 6. Where SQL (and so Postgres) departs from the pure model

Knowing these up front explains a lot of SQL behaviour:

| Pure relational model | SQL / Postgres | Practical consequence |
|---|---|---|
| Relations are sets (no duplicates) | Tables and results are **bags** (duplicates allowed) | Projection keeps duplicates; you write `DISTINCT` to remove them. A table without a primary key can hold identical rows. |
| No row order | No *guaranteed* order, but `ORDER BY` exists for output | Without `ORDER BY`, row order is whatever the plan produces. |
| Attributes unordered, accessed by name | Columns have a position (`SELECT *` order, `INSERT` without a column list) | Prefer naming columns explicitly. |
| Union/difference on sets | `UNION`, `EXCEPT` remove duplicates; `UNION ALL`, `EXCEPT ALL` keep them | `UNION ALL` is faster when you know there's no overlap (no dedupe step). |

SQL keeps duplicates because removing them costs a sort or a hash on every projection. Early
implementers chose speed and let you opt in with `DISTINCT`.

---

## 🛠️ How to Implement It

The best way to *feel* the model is to build its operators yourself. Below is a tiny relational
algebra engine in TypeScript, where relations are arrays of plain objects. Then the same queries
run in real Postgres in the playground.

### Step 1: represent a relation

```ts
// A tuple maps attribute names to atomic values (first normal form: no arrays, no nesting).
type Row = Record<string, string | number | null>;

// A relation is a set of tuples. Arrays allow duplicates, so the operators below
// restore the "set" property explicitly wherever the theory requires it.
type Relation = Row[];

const customers: Relation = [
  { id: 1, name: "Asha", city: "Bengaluru" },
  { id: 2, name: "Rahul", city: "Mumbai" },
  { id: 3, name: "Kabir", city: null },
];

const orders: Relation = [
  { order_id: 101, customer_id: 1, status: "shipped" },
  { order_id: 102, customer_id: 1, status: "paid" },
  { order_id: 103, customer_id: 2, status: "cancelled" },
];
```

### Step 2: give tuples an identity, so duplicates can be detected

Two JavaScript objects with the same contents are different objects (`{a:1} !== {a:1}`). The set
property needs *value* equality, so build a key from the sorted attribute names and values.
Attribute order then doesn't matter, matching the theory that attributes are unordered:

```ts
function rowKey(row: Row): string {
  const sorted = Object.keys(row).sort().map((k) => [k, row[k]]);
  return JSON.stringify(sorted);
}

function distinct(relation: Relation): Relation {
  const seen = new Set<string>();
  const result: Relation = [];
  for (const row of relation) {
    const key = rowKey(row);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(row);
    }
  }
  return result;
}
```

### Step 3: selection and projection

```ts
// σ — horizontal cut. Selection can't create duplicates, so no distinct() needed.
function select(relation: Relation, predicate: (row: Row) => boolean): Relation {
  return relation.filter(predicate);
}

// π — vertical cut. Dropping columns CAN make rows identical, so the set property
// must be restored. Leave out this distinct() and you have SQL's behaviour, not Codd's.
function project(relation: Relation, columns: string[]): Relation {
  const narrowed = relation.map((row) => {
    const out: Row = {};
    for (const col of columns) out[col] = row[col];
    return out;
  });
  return distinct(narrowed);
}

select(customers, (r) => r.city === "Bengaluru");
// [ { id: 1, name: 'Asha', city: 'Bengaluru' } ]

project(orders, ["customer_id"]);
// [ { customer_id: 1 }, { customer_id: 2 } ]   ← three rows in, two out
```

### Step 4: product, and join as "product then select"

```ts
// × — every left tuple paired with every right tuple: |A| × |B| results.
// Spread merges the attributes. If both sides shared a name, one would overwrite
// the other, which is exactly why rename (ρ) exists in the algebra.
function product(a: Relation, b: Relation): Relation {
  const result: Relation = [];
  for (const left of a) {
    for (const right of b) {
      result.push({ ...left, ...right });
    }
  }
  return result;
}

// ⋈ — literally the definition: product, then selection on the matching condition.
function join(a: Relation, b: Relation, on: (row: Row) => boolean): Relation {
  return select(product(a, b), on);
}

product(customers, orders).length; // 9
```

### Step 5: set operations and rename

```ts
function union(a: Relation, b: Relation): Relation {
  return distinct([...a, ...b]);
}

function difference(a: Relation, b: Relation): Relation {
  const inB = new Set(b.map(rowKey));
  return a.filter((row) => !inB.has(rowKey(row)));
}

function rename(relation: Relation, from: string, to: string): Relation {
  return relation.map((row) => {
    const { [from]: value, ...rest } = row;
    return { ...rest, [to]: value };
  });
}
```

### Step 6: compose them, because closure means every output is a valid input

```ts
// "Names of customers with a shipped order": the operator tree from section 3, as code.
const shippedNames = project(
  select(
    join(customers, orders, (r) => r.id === r.customer_id),
    (r) => r.status === "shipped",
  ),
  ["name"],
);
// [ { name: 'Asha' } ]

// "Customers who never ordered" = all customer ids − ids that appear in orders.
// rename makes the two sides union-compatible (both call the attribute "id").
const everyone = project(customers, ["id"]);
const buyers = rename(project(orders, ["customer_id"]), "customer_id", "id");
difference(everyone, buyers);
// [ { id: 3 } ]   ← Kabir
```

### Step 7: same meaning, different algorithm (the optimizer's freedom)

`join` above builds the full product, which is O(|A| × |B|). A real database never does that. Here is
a **hash join** that returns *exactly the same relation* in O(|A| + |B|):

```ts
// Build a hash table on one side's key, then probe it once per row of the other side.
// Same result as join(customers, orders, ...), very different cost: this is why a
// declarative query leaves the "how" to the database.
function hashJoin(a: Relation, b: Relation, aKey: string, bKey: string): Relation {
  const index = new Map<unknown, Row[]>();
  for (const right of b) {
    const key = right[bKey];
    if (!index.has(key)) index.set(key, []);
    index.get(key)!.push(right);
  }

  const result: Relation = [];
  for (const left of a) {
    for (const right of index.get(left[aKey]) ?? []) {
      result.push({ ...left, ...right });
    }
  }
  return result;
}

hashJoin(customers, orders, "id", "customer_id").length; // 3 — same 3 rows as join()
```

Any code that calls `join` gets the same answer if you swap in `hashJoin`. That is data independence
in miniature. Postgres makes this swap for you, per query, based on table sizes.

To run this file yourself: save it as `relational.ts`, add some `console.log` calls, and run
`node --experimental-strip-types relational.ts` (Node 22.6+; newer Node versions strip types without
the flag).

### Step 8: the same algebra in real Postgres

Every operator above has a SQL form, and the playground runs each one against the seeded shop
database:

```bash
cd INTERVIEW_PREP/POSTGRES/playground && npm install
```

```bash
npm run q -- relational-model
```

The file is [`queries/learn/00-001-relational-model.sql`](../../INTERVIEW_PREP/POSTGRES/playground/queries/learn/00-001-relational-model.sql).
It walks through:

| Algebra | SQL |
|---|---|
| σ condition (R) | `SELECT * FROM r WHERE condition` |
| π a, b (R) | `SELECT DISTINCT a, b FROM r` (plain `SELECT a, b` keeps duplicates: a bag) |
| R × S | `SELECT * FROM r CROSS JOIN s` |
| R ⋈ S | `SELECT * FROM r JOIN s ON r.id = s.r_id` |
| R ∪ S, R − S | `UNION`, `EXCEPT` |
| ρ | `AS` (column and table aliases) |

It also shows a primary key rejecting a duplicate tuple, a foreign key rejecting an order for a
customer who doesn't exist, the NULL trap from section 5, and data independence: adding an index,
then re-running an unchanged query that returns the same rows.

---

## ⚖️ Trade-offs, When to Use, and Pitfalls

**Where the relational model shines**

- Data with many relationships that will be queried in ways you can't fully predict. This describes
  most business data: users, orders, payments, inventory.
- Data where correctness matters more than raw write throughput, because keys and constraints give
  you guarantees no application code can bypass.
- Long-lived systems, where data independence lets you tune storage (indexes, partitioning) for years
  without rewriting queries.

**Where it is a weaker fit**

- Data that is naturally one big nested document always read as a whole, where splitting it into
  tables and joining it back costs more than it buys. Postgres's `jsonb` covers much of this inside a
  relational database. A later chapter covers it.
- Huge append-only streams or simple key → value lookups at extreme scale, where specialised stores
  can be simpler.

**History repeating.** Many "NoSQL" document databases resemble the 1960s hierarchical model: data
stored as nested trees, cheap along the path the tree was designed for and awkward against it.
Stonebraker and Hellerstein's essay *"What Goes Around Comes Around"* (2005) traces this cycle, and a
2024 follow-up by Stonebraker and Andrew Pavlo revisits it. Knowing the history lets you recognise
the trade-off when a new data model is pitched.

**Common pitfalls**

- **Re-inventing navigation in application code.** Loading customers, then looping over them and
  issuing one query per customer for their orders (the "N+1 query" problem) is the treasure-map
  approach rebuilt in JavaScript. One join lets the optimizer do it set-at-a-time.
- **Relying on row order** without `ORDER BY`. Results come back in whatever order the plan produces,
  and that can change when data grows or an index is added.
- **Comparing with NULL using `=` or `<>`.** Use `IS NULL`, `IS NOT NULL`, or
  `IS DISTINCT FROM` (which treats two NULLs as equal).
- **Tables without a primary key.** SQL allows them, but then duplicates can creep in and nothing
  identifies a row. Always define one.
- **Treating the database as a dumb file.** Skipping foreign keys and constraints "for flexibility"
  throws away referential integrity, the guarantee the model was built to give you.

---

## 🧠 Q&A Bank

**1. What is a relation, formally?**
A set of tuples over a fixed list of named attributes, each drawing its values from a domain. In
other words, a subset of the Cartesian product of those domains. In SQL terms: a table whose rows are
all distinct and unordered.

**2. What problem was Codd trying to solve in 1970, and what did he call the goal?**
Programs in navigational (network and hierarchical) databases depended on how data was physically
stored: its ordering, its indexes and its pointer access paths. Changing storage broke programs. His
goal was **data independence**: physical storage can change without changing the programs that use
the data.

**3. How does a relational database represent the relationship between an order and its customer, and why does that matter?**
As a *value*: the order stores the customer's key in a foreign key column. There is no pointer.
Because the link is just matching values, it can be followed in either direction ("orders of this
customer" and "customer of this order"), and storage can be reorganised freely, since there are no
pointers to invalidate.

**4. Why does projection remove duplicates in relational algebra but not in SQL?**
In the algebra a relation is a set, and a set can't hold the same tuple twice, so dropping columns
that made rows distinct collapses them. SQL works with bags (multisets) for performance, since
deduplication needs a sort or hash, and makes you ask for set behaviour with `DISTINCT`.

**5. What is the "closure" property, and why does it matter for query planning?**
Every operator takes relations and returns a relation, so operators compose into trees of any depth.
A query plan is such a tree. Because subtrees are interchangeable relations, the optimizer can
rewrite the tree (push filters down, reorder joins) into an equivalent but cheaper one.

**6. Write the join of customers and orders using only primitive operators.**
σ customers.id = orders.customer_id (customers × orders). That is the Cartesian product followed by a
selection on the matching condition. Real databases compute the same result with nested-loop, hash
or merge joins instead of building the product.

**7. What happens to a customer whose `city` is NULL in `WHERE city = 'Mumbai'` and in `WHERE city <> 'Mumbai'`?**
They appear in neither. Both comparisons with NULL evaluate to UNKNOWN, and `WHERE` keeps only rows
where the condition is TRUE. You must write `WHERE city IS NULL` to find them.

**8. Why is `σ status='shipped'(customers ⋈ orders)` equivalent to `customers ⋈ σ status='shipped'(orders)`, and why would an optimizer prefer the second?**
`status` belongs only to `orders`, so filtering it before or after the join removes exactly the same
pairs. The second form joins fewer rows, which is less work. This rewrite is called predicate
pushdown.

**9. What did System R contribute beyond proving the relational model could work?**
The SEQUEL/SQL language (Chamberlin and Boyce) and the cost-based query optimizer (Selinger et al.,
1979). The optimizer estimates the cost of alternative plans from statistics and picks the cheapest.
That answered the main objection to the relational model (that it couldn't be fast), and Postgres's
planner follows the same approach.

**10. What happens if you add an index to a table: do existing queries change their results?**
No. An index is only an alternative access path. It can change *how fast* a query runs, and the
optimizer decides whether to use it, but never *what* the query returns. If adding an index could
change answers, data independence would be broken.

**11. How is the 1960s hierarchical model similar to some modern document databases, and what trade-off do they share?**
Both store data as nested trees (a parent containing its children). Reading along the designed path
(a whole order with its items) is fast. Querying against it (all orders containing product X, across
all customers) is awkward, which is the same access-path dependence Codd described.

**12. Why must the two inputs of a union or difference be "union-compatible", and which operator helps make them so?**
Union and difference compare whole tuples, so both relations must have the same attributes (same
names and compatible domains). Otherwise "the same tuple" is meaningless. Rename (ρ, or `AS` in SQL)
aligns the attribute names.

---

## 🏋️ Hands-on Exercise

**Goal: answer a "for all" question three ways.**

The question: **which customers bought *every* product in the `electronics` category?** (In the seed
data that is four products.) In algebra this is **division**, the one operator in this lesson you
haven't implemented.

1. **TypeScript.** Add `intersection(a, b)` to the engine using only `difference`. Then implement
   `divide(r, s)`, which returns the values of r's other attributes that are paired in r with *every*
   tuple of s. Test it on a small hand-made purchases relation.
2. **SQL with sets.** In `queries/scratch.sql`, write it with `EXCEPT`: for a customer, "electronics
   products − products this customer bought" should be empty.
3. **SQL with logic.** Write it again with a double `NOT EXISTS`: "there is no electronics product
   that this customer has not bought."

Run with `npm run q -- scratch`.

**Hint:** division is defined as π_A(R) − π_A((π_A(R) × S) − R), where A is the attributes of R that
are not in S. Read it inside-out: the product builds every (customer, product) pair that *should*
exist, subtracting R leaves the pairs that are *missing*, and any customer with a missing pair is
removed. The double `NOT EXISTS` is the same sentence in predicate logic. With the seed data the
answer should be empty, since no one bought all four, so add an order in your scratch file to make
one customer qualify and check that your query finds them.

---

## ✅ Recap

- Before 1970, databases were **navigational**: programs walked pointers and trees, so they broke
  whenever storage changed. Codd named the cure **data independence**.
- The relational model stores everything as **relations** (sets of tuples). Relationships are
  **matching values** (foreign keys), not pointers, so they work in every direction.
- A small **closed algebra** (σ, π, ×, ∪, −, ρ, plus joins built from them) composes into query
  trees. Codd showed it is equivalent to logic, which is why you can write *what* you want and let
  the database decide *how*.
- The **optimizer** exploits that freedom by rewriting trees (predicate pushdown, join reordering)
  and choosing algorithms (nested loop, hash, merge) without changing the answer. System R
  pioneered it, and Postgres does it today.
- SQL departs from the pure model: **duplicates (bags), column order, NULL and three-valued logic**.
  Knowing the departures explains most of SQL's surprises.

---

## 📎 Primary Sources (optional)

The lesson above is complete on its own. Nothing here is required. These are the original works the
history refers to, for anyone who wants to read them directly.

- E. F. Codd, "A Relational Model of Data for Large Shared Data Banks," *Communications of the ACM*,
  13(6), June 1970.
- E. F. Codd, "Relational Completeness of Data Base Sublanguages," IBM Research Report, 1972.
- C. W. Bachman, "The Programmer as Navigator," 1973 ACM Turing Award Lecture, *Communications of
  the ACM*, 16(11), 1973.
- D. D. Chamberlin and R. F. Boyce, "SEQUEL: A Structured English Query Language," ACM SIGFIDET
  Workshop, 1974.
- P. G. Selinger et al., "Access Path Selection in a Relational Database Management System," ACM
  SIGMOD, 1979.
- M. Stonebraker and J. M. Hellerstein, "What Goes Around Comes Around," in *Readings in Database
  Systems*, 4th ed., 2005.
