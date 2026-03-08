import { LogFn } from "./types.js";

/**
 * Build a pipeline around a fixed initial value.
 *
 * `pipeFrom(value)` returns a callable that accepts 0..N unary operations
 * and runs the provided `value` through them left-to-right.
 *
 * The returned callable exposes overloads so the operation parameter and
 * return types are properly inferred from the initial value and each
 * operation's signature.
 *
 * Example:
 * ```ts
 * const p = pipeFrom(2);
 * const r1 = p(); // 2
 * const r2 = p((n: number) => n + 1); // 3
 * const r3 = p((n: number) => n + 1, (m: number) => String(m)); // '3'
 * ```
 */
export type pipeFromFn = {
  <T>(
    value: T,
    options?: { log: LogFn },
  ): {
    (): T;
    <A>(op1: (input: T) => A): A;
    <A, B>(op1: (input: T) => A, op2: (input: A) => B): B;
    <A, B, C>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
    ): C;
    <A, B, C, D>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
      op4: (input: C) => D,
    ): D;
    <A, B, C, D, E>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
      op4: (input: C) => D,
      op5: (input: D) => E,
    ): E;
    <A, B, C, D, E, F>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
      op4: (input: C) => D,
      op5: (input: D) => E,
      op6: (input: E) => F,
    ): F;
    <A, B, C, D, E, F, G>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
      op4: (input: C) => D,
      op5: (input: D) => E,
      op6: (input: E) => F,
      op7: (input: F) => G,
    ): G;
    <A, B, C, D, E, F, G, H>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
      op4: (input: C) => D,
      op5: (input: D) => E,
      op6: (input: E) => F,
      op7: (input: F) => G,
      op8: (input: G) => H,
    ): H;
    <A, B, C, D, E, F, G, H, I>(
      op1: (input: T) => A,
      op2: (input: A) => B,
      op3: (input: B) => C,
      op4: (input: C) => D,
      op5: (input: D) => E,
      op6: (input: E) => F,
      op7: (input: F) => G,
      op8: (input: G) => H,
      op9: (input: H) => I,
    ): I;
    <A, B, C, D, E, F, G, H, I>(
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
  <T>(
    value: T,
    options: { bypassNull: true; log?: LogFn },
  ): {
    (): T;

    <A>(op1: (input: T) => A): A | (null extends A ? null : never);

    <A, B>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
    ): B | (null extends A ? null : null extends B ? null : never);

    <A, B, C>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
    ):
      | C
      | (null extends A
          ? null
          : null extends B
            ? null
            : null extends C
              ? null
              : never);

    <A, B, C, D>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
      op4: (input: Exclude<C, null>) => D,
    ):
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

    <A, B, C, D, E>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
      op4: (input: Exclude<C, null>) => D,
      op5: (input: Exclude<D, null>) => E,
    ):
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

    <A, B, C, D, E, F>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
      op4: (input: Exclude<C, null>) => D,
      op5: (input: Exclude<D, null>) => E,
      op6: (input: Exclude<E, null>) => F,
    ):
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

    <A, B, C, D, E, F, G>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
      op4: (input: Exclude<C, null>) => D,
      op5: (input: Exclude<D, null>) => E,
      op6: (input: Exclude<E, null>) => F,
      op7: (input: Exclude<F, null>) => G,
    ):
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

    <A, B, C, D, E, F, G, H>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
      op4: (input: Exclude<C, null>) => D,
      op5: (input: Exclude<D, null>) => E,
      op6: (input: Exclude<E, null>) => F,
      op7: (input: Exclude<F, null>) => G,
      op8: (input: Exclude<G, null>) => H,
    ):
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

    <A, B, C, D, E, F, G, H, I>(
      op1: (input: T) => A,
      op2: (input: Exclude<A, null>) => B,
      op3: (input: Exclude<B, null>) => C,
      op4: (input: Exclude<C, null>) => D,
      op5: (input: Exclude<D, null>) => E,
      op6: (input: Exclude<E, null>) => F,
      op7: (input: Exclude<F, null>) => G,
      op8: (input: Exclude<G, null>) => H,
      op9: (input: Exclude<H, null>) => I,
    ):
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

    <A, B, C, D, E, F, G, H, I>(
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
};

export const pipeFrom: pipeFromFn = ((
  value: unknown,
  options: {
    bypassNull?: true;
    log?: LogFn;
  },
) =>
  options?.bypassNull
    ? (...args: ((input: unknown) => unknown)[]) =>
        args.reduce(
          (acc, curr, idx) =>
            acc !== null
              ? (options?.log?.({ value: acc, idx, fnc: curr }), curr(acc))
              : acc,
          value,
        )
    : (...args: ((input: unknown) => unknown)[]) =>
        args.reduce(
          (acc, curr, idx) => (
            options?.log?.({ value: acc, idx, fnc: curr }),
            curr(acc)
          ),
          value,
        )) as pipeFromFn;
