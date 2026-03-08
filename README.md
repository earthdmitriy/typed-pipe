# typed-pipe

A set of utilities for functional composition (pipe) with first-class TypeScript support.  
Create function chains, automatically skip steps on `null`, log each step, and flexibly configure behavior—all with precise type inference that other libraries lack.

## Installation

```bash
npm install typed-pipe
# or
yarn add typed-pipe
```

## Features

- **Basic pipe** – similar to `_.flow` in lodash, but with perfect type inference.
- **Skip on null (`pipeSkipNull`)** – if a function in the chain returns `null`, subsequent functions are skipped and the final result becomes `null`.
- **Logging** – pass a logging function to inspect values at each step without modifying your functions.
- **Configurable factory (`createPipe`)** – create a pipe version with your preferred options.
- **Immediate execution with `pipeFrom`** – apply a chain directly to a given value, with a clean syntax that separates the initial value from the operators, plus optional configuration for null skipping and logging.
- **Superior type safety** – TypeScript infers types at every step and correctly adds `null` to the return type if any function in the chain can return `null`. Other solutions either lose type information or require manual annotations.

## API

### `pipe`

Basic pipe. Takes any number of functions and returns a new function that passes the result of each to the next.

```typescript
import { pipe } from 'typed-pipe';

const add1 = (x: number) => x + 1;
const toString = (x: number) => `result: ${x}`;

const fn = pipe(add1, toString);
console.log(fn(5)); // "result: 6"
```

TypeScript infers `fn` as `(input: number) => string` automatically.

---

### `pipeSkipNull`

Pipe version that stops execution when `null` is encountered.  
If any function returns `null`, later functions are not called, and the whole chain yields `null`.  
The return type is augmented with `| null` if at least one function can return `null`.

```typescript
import { pipeSkipNull } from 'typed-pipe';

const safeDivide = (x: number) => (x === 0 ? null : 10 / x);
const double = (x: number) => x * 2;

const fn = pipeSkipNull(safeDivide, double);
// Type: (input: number) => number | null

console.log(fn(2)); // 10 (5 * 2)
console.log(fn(0)); // null (double is not called)
```

Notice: `double` is declared with a `number` parameter—it will never receive `null` because the chain short‑circuits. TypeScript understands this thanks to `Exclude` in the types.

> **Note**: `pipeSkipNull` only short‑circuits on `null`, not on `undefined`. If you need to handle `undefined`, you can transform it to `null` at the appropriate step.

---

### `createPipe`

A factory to create configured pipe functions. Enable `skipNull` (alias for `bypassNull`) and/or pass a logging function.

```typescript
import { createPipe, type LogFn } from 'typed-pipe';

// Proper logger matching LogFn interface
const log: LogFn = ({ value, idx, fnc }) => {
  console.log(`[step ${idx}] input:`, value, 'function:', fnc.name);
};

// Create a pipe with logging
const pipeWithLog = createPipe({ log });

// Create a pipe with skipNull and logging
const pipeWithSkipAndLog = createPipe({ skipNull: true, log });

// Usage
const fn = pipeWithSkipAndLog(
  (x: number) => (x > 0 ? x : null),
  (x: number) => x * 2
);

fn(5);  // logs [step 0] input: 5, function: (anonymous)  (or actual function name if named)
fn(-1); // logs [step 0] input: -1, ... step 1 is skipped
```

Calling `createPipe()` without arguments returns the basic `pipe`.

---

### `pipeFrom`

Applies a chain of functions directly to a specific value, without creating an intermediate function.  
The syntax cleanly separates the initial value (and optional configuration) from the operators, making it highly readable.  
Supports the same options: `skipNull` and `log`.

```typescript
import { pipeFrom } from 'typed-pipe';

// With options: skipNull and a logger
const result = pipeFrom(
  5,
  { 
    skipNull: true, 
    log: ({ value, idx, fnc }) => console.log(`Step ${idx}:`, value) 
  }
)(
  (x) => x * 2,
  (x) => x > 10 ? x : null,
  (x) => x / 2  // not called because previous returned null
);

console.log(result); // null (and you'll see logs)
```

Without options it works as a basic pipe over the value:

```typescript
const res = pipeFrom(5)((x) => x + 1, (x) => x * 2);
console.log(res); // 12
// TypeScript infers res as number
```

---

## Developer Experience: Type Inference in Action

One of the biggest advantages of `typed-pipe` is the seamless type inference as you build your pipeline. Because execution is left‑to‑right and types flow naturally, your IDE can guide you at every step.

Consider this example using `pipeFrom`:

```typescript
import { pipeFrom } from 'typed-pipe';

// Start with a concrete value – TypeScript knows it's a number
const result = pipeFrom(42)(
  // As soon as you type the first function, the parameter is inferred as number
  (x) => {
    // x: number – IDE autocompletion shows number methods
    return x.toString(); // returns string
  },
  // Next function receives a string
  (x) => {
    // x: string – IDE now suggests string methods
    return x.split(""); // returns string[]
  },
  // Next receives string[]
  (x) => {
    // x: string[] – array methods available
    return x.map((char) => char.charCodeAt(0)); // returns number[]
  },
  // Final function receives number[]
  (x) => {
    // x: number[] – we can compute the sum
    return x.reduce((a, b) => a + b, 0); // returns number
  }
);

// result is number
console.log(result); // 102 (ASCII sum of "42")
```

**What makes this DX exceptional?**

- **Progressive inference**: At each step, TypeScript knows the exact type of the incoming value, so your IDE can offer relevant autocompletion.
- **No manual type annotations**: You never need to write `: number` or `: string` – the types are propagated automatically.
- **Safety with nullable values**: If you enable `skipNull`, the type system will remind you that a `null` might appear, and you can handle it accordingly.

This natural flow makes `pipeFrom` a joy to use, especially when transforming data through multiple stages. It’s like having a conversation with the compiler: you write the next step, and it tells you what’s available.

---

## Developer Experience: Debugging Made Simple

When something goes wrong in a long pipeline, you no longer need to sprinkle `console.log` statements or set breakpoints inside every function. Just add a logger at the start:

```typescript
import { pipeFrom } from 'typed-pipe';

const log: LogFn = ({ value, idx }) => console.log(`Step ${idx}:`, value);

const result = pipeFrom(initialData, { log })(
  step1,
  step2,
  step3
);
```

The logger will be called **before** each function, giving you full visibility into the pipeline’s flow. In `skipNull` mode, logging stops automatically once `null` is produced, so you can immediately see where the chain broke.

---

## Comparison with other solutions

### Lodash `_.flow`

Lodash provides `_.flow` for left‑to‑right composition and `_.flowRight` for right‑to‑left.  
However:

- `_.flow` has **no built‑in null handling** – you must manually check results at each step.
- **Type inference is weak**: Lodash’s types often fall back to `any` or lose precision after a few functions. For complex chains you may need to annotate types manually.
- **No logging support** without wrapping your functions.

`typed-pipe` solves these problems out‑of‑the‑box with full TypeScript support and precise inference.

### Ramda `R.pipe`

Ramda also offers `R.pipe` (and `R.compose`), but:

- **No automatic null propagation** – you need to use combinators like `R.when` or `R.ifElse` to handle nullable values.
- **Type inference is limited**: Ramda’s pipe types often collapse unions incorrectly, and generic inference can break with more than a few arguments.
- **Logging requires `R.tap`**, which still forces you to write extra code.

`typed-pipe` keeps your types accurate and your code clean.

### fp-ts `pipe`

`fp-ts` is a popular library for functional programming in TypeScript. It provides a `pipe` function, but with a different philosophy:

- `fp-ts` `pipe` is a **runtime helper** that applies a sequence of operations to a value, not a function that *creates* a new reusable function.  
  In contrast, `typed-pipe` gives you both: `pipe` creates reusable functions, while `pipeFrom` offers an immediate‑execution style that many find more intuitive.
- **Syntax**: `fp-ts` pipe typically looks like `pipe(initialValue, op1, op2, op3)`. This mixes the initial value with the operators, which can become less readable when operators are many.  
  `typed-pipe`’s `pipeFrom(initialValue, options?)(op1, op2, ...)` clearly separates the data from the transformations, and the optional configuration is kept apart.
- **Null handling**: `fp-ts` does not provide a built‑in mechanism for short‑circuiting on `null`; you would need to work with `Option` types or other structures, adding complexity.

`typed-pipe` stays simple and focused: synchronous function composition with null skipping and logging, backed by rock‑solid TypeScript inference, and a clean API that separates concerns.

## TypeScript: why our inference is better

We leverage conditional types and `Exclude` to track nullability through the chain.  
For example, in `pipeSkipNull`, the second function’s input is `Exclude<A, null>`, ensuring `null` never reaches it. The final return type includes `null` **only if** any function in the chain can return `null` (checked via `null extends A`, etc.). This gives you maximal safety without losing information.

Compare this to other libraries where a nullable intermediate value often forces the whole return type to become `any` or requires manual type assertions.

### Example of type inference

```typescript
const fn = pipeSkipNull(
  (x: number) => x > 0 ? x : null,    // may return null
  (x: number) => x.toString()         // never returns null
);
// TypeScript correctly infers: (input: number) => string | null
```

In lodash, the equivalent chain would likely lose the `null` possibility or force you to handle it unsafely.

---

## Logging

The logging function must match the `LogFn` type:

```typescript
type LogFn = (params: {
  value: unknown;   // current input value to the function
  idx: number;      // step index (0, 1, …)
  fnc: Function;    // the function about to be called
}) => void;
```

You can use it for debugging, profiling, or simply printing to the console. The function is called **before** executing the corresponding pipeline step, giving you a chance to inspect the input.

---

## Conclusion

`typed-pipe` is a lightweight yet powerful replacement for common function composition utilities, designed specifically for TypeScript projects.  
It simplifies null handling, adds debugging capabilities, provides a clean and flexible API (including the immediate‑execution `pipeFrom` with optional configuration), and—most importantly—preserves strict type inference where other solutions fall short. Try it in your next project!