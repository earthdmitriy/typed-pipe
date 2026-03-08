/**
 * A pipe builder similar to `PipeFn` but with null-bypass semantics.
 *
 * If any step returns `null`, the pipeline short-circuits and further
 * operations are skipped, returning `null` as the final result. This is
 * useful when an intermediate operation may intentionally signal the lack of
 * a value and you want to avoid subsequent work.
 *
 * Behavior notes:
 * - When called with no operations it produces an identity function.
 * - All overloads return a unary function `(input: T) => R` for convenience.
 *
 * Example:
 * ```ts
 * const toOne = (n: number) => 1;
 * const toNull = (_: number) => null as null;
 * const inc = (n: number) => n + 1;
 * const p = pipeSkipNull(toOne, toNull, inc);
 * // toNull returns null, so `inc` is not called and pipeline returns null
 * const r = p(5); // null
 * ```
 */
export type pipeSkipNullFn = {
  (): void;

  <T, A>(
    op1: (input: T) => A,
  ): (input: T) => A | (null extends A ? null : never);

  <T, A, B>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
  ): (input: T) => B | (null extends A ? null : null extends B ? null : never);

  <T, A, B, C>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
  ): (
    input: T,
  ) =>
    | C
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : never);

  <T, A, B, C, D>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
  ): (
    input: T,
  ) =>
    | D
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : null extends D
              ? null
              : never);

  <T, A, B, C, D, E>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
    op5: (input: Exclude<D, null>) => E,
  ): (
    input: T,
  ) =>
    | E
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : null extends D
              ? null
              : null extends E
                ? null
                : never);

  <T, A, B, C, D, E, F>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
    op5: (input: Exclude<D, null>) => E,
    op6: (input: Exclude<E, null>) => F,
  ): (
    input: T,
  ) =>
    | F
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : null extends D
              ? null
              : null extends E
                ? null
                : null extends F
                  ? null
                  : never);

  <T, A, B, C, D, E, F, G>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
    op5: (input: Exclude<D, null>) => E,
    op6: (input: Exclude<E, null>) => F,
    op7: (input: Exclude<F, null>) => G,
  ): (
    input: T,
  ) =>
    | G
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : null extends D
              ? null
              : null extends E
                ? null
                : null extends F
                  ? null
                  : null extends G
                    ? null
                    : never);

  <T, A, B, C, D, E, F, G, H>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
    op5: (input: Exclude<D, null>) => E,
    op6: (input: Exclude<E, null>) => F,
    op7: (input: Exclude<F, null>) => G,
    op8: (input: Exclude<G, null>) => H,
  ): (
    input: T,
  ) =>
    | H
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : null extends D
              ? null
              : null extends E
                ? null
                : null extends F
                  ? null
                  : null extends G
                    ? null
                    : null extends H
                      ? null
                      : never);

  <T, A, B, C, D, E, F, G, H, I>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
    op5: (input: Exclude<D, null>) => E,
    op6: (input: Exclude<E, null>) => F,
    op7: (input: Exclude<F, null>) => G,
    op8: (input: Exclude<G, null>) => H,
    op9: (input: Exclude<H, null>) => I,
  ): (
    input: T,
  ) =>
    | I
    | (null extends A
        ? null
        : null extends B
          ? null
          : null extends C
            ? null
            : null extends D
              ? null
              : null extends E
                ? null
                : null extends F
                  ? null
                  : null extends G
                    ? null
                    : null extends H
                      ? null
                      : null extends I
                        ? null
                        : never);

  <T, A, B, C, D, E, F, G, H, I>(
    op1: (input: T) => A,
    op2: (input: Exclude<A, null>) => B,
    op3: (input: Exclude<B, null>) => C,
    op4: (input: Exclude<C, null>) => D,
    op5: (input: Exclude<D, null>) => E,
    op6: (input: Exclude<E, null>) => F,
    op7: (input: Exclude<F, null>) => G,
    op8: (input: Exclude<G, null>) => H,
    op9: (input: Exclude<H, null>) => I,
    ...operations: ((input: unknown) => unknown)[]
  ): unknown;
};

/**
 * Build a pipeline that composes unary functions left-to-right and bypasses
 * subsequent operations if a `null` value is produced by any step.
 *
 * Example:
 * ```ts
 * import { pipeSkipNull } from './typedpipeSkipNull';
 * const a = (n: number) => n + 1;
 * const maybeNull = (n: number) => (n > 0 ? n : null as null);
 * const p = pipeSkipNull(a, maybeNull, a);
 * console.log(p(1)); // 3
 * console.log(p(-10)); // null (second step returned null, third step skipped)
 * ```
 */
export const pipeSkipNull: pipeSkipNullFn =
  (...args: ((input: unknown) => unknown)[]) =>
  (value: unknown) =>
    args.reduce((acc, curr) => (acc !== null ? curr(acc) : acc), value);
