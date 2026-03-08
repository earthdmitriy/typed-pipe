/**
 * A typed variadic pipe builder.
 *
 * The `PipeFn` type describes a function that accepts 0..N unary operations
 * and returns a new function which accepts the initial input and returns the
 * final output after applying all operations left-to-right.
 *
 * Notes:
 * - When called with no operations it produces an identity function.
 * - Type overloads provide helpful inference for up to 9 operations; an
 *   additional rest parameter is accepted but typed as `unknown` for cases
 *   beyond that.
 *
 * Example:
 * ```ts
 * const inc = (x: number) => x + 1;
 * const dbl = (x: number) => x * 2;
 * const p = pipe(inc, dbl); // (value: number) => number
 * const result = p(2); // (2 + 1) * 2 === 6
 * ```
 */
export type PipeFn = {
  (): void;
  <T, A>(op1: (input: T) => A): (input: T) => A;
  <T, A, B>(op1: (input: T) => A, op2: (input: A) => B): (input: T) => B;
  <T, A, B, C>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
  ): (input: T) => C;
  <T, A, B, C, D>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
  ): (input: T) => D;
  <T, A, B, C, D, E>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
    op5: (input: D) => E,
  ): (input: T) => E;
  <T, A, B, C, D, E, F>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
    op5: (input: D) => E,
    op6: (input: E) => F,
  ): (input: T) => F;
  <T, A, B, C, D, E, F, G>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
    op5: (input: D) => E,
    op6: (input: E) => F,
    op7: (input: F) => G,
  ): (input: T) => G;
  <T, A, B, C, D, E, F, G, H>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
    op5: (input: D) => E,
    op6: (input: E) => F,
    op7: (input: F) => G,
    op8: (input: G) => H,
  ): (input: T) => H;
  <T, A, B, C, D, E, F, G, H, I>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
    op5: (input: D) => E,
    op6: (input: E) => F,
    op7: (input: F) => G,
    op8: (input: G) => H,
    op9: (input: H) => I,
  ): (input: T) => I;
  <T, A, B, C, D, E, F, G, H, I>(
    op1: (input: T) => A,
    op2: (input: A) => B,
    op3: (input: B) => C,
    op4: (input: C) => D,
    op5: (input: D) => E,
    op6: (input: E) => F,
    op7: (input: F) => G,
    op8: (input: G) => H,
    op9: (input: H) => I,
    ...operations: ((input: unknown) => unknown)[]
  ): unknown;
};

/**
 * Build a pipeline that composes unary functions left-to-right.
 *
 * Returns a function that accepts the initial value and runs it through each
 * operation in order. This implementation is intentionally tiny and
 * high-performance by delegating to Array#reduce.
 *
 * Example:
 * ```ts
 * import { pipe } from './typedPipe';
 * const inc = (n: number) => n + 1;
 * const dbl = (n: number) => n * 2;
 * const run = pipe(inc, dbl);
 * console.log(run(3)); // 8
 * ```
 */
export const pipe: PipeFn =
  (...args: ((input: unknown) => unknown)[]) =>
  (value: unknown) =>
    args.reduce((acc, curr) => curr(acc), value);
