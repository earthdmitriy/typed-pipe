import { pipe, PipeFn, pipeSkipNull, pipeSkipNullFn } from "./index.js";
import { LogFn } from "./types.js";

/**
 * Factory for creating pipelines with optional behaviors.
 *
 * `createPipe` can be called with an options object to pick between the
 * regular `pipe`, a `pipeSkipNull`, and to enable a `log` hook which
 * is invoked before each step.
 *
 * The returned function matches the chosen pipeline flavor:
 * - default: returns `pipe` (no logging, no bypass)
 * - { bypassNull: true }: returns `pipeSkipNull`
 * - { log }: returns a wrapper around `pipe` which calls `log` before each step
 *
 * Example usage:
 * ```ts
 * import { createPipe } from './createPipe';
 *
 * // default pipeline
 * const p = createPipe();
 * console.log(p((n: number) => n + 1)((5))); // 6
 *
 * // with bypassNull
 * const pb = createPipe({ bypassNull: true });
 * console.log(pb((n: number) => (n > 0 ? n : null as null)))(-1)); // null
 *
 * // with logging
 * const logged = createPipe({ log: ({ value, idx }) => console.log(idx, value) });
 * logged((n: number) => n + 1)((2)); // logs intermediate values
 * ```
 */
export type createPipeFn = {
  (): PipeFn;
  (op: { bypassNull: true }): pipeSkipNullFn;
  (op: { bypassNull: true; log: LogFn }): pipeSkipNullFn;
  (op: { log: LogFn }): PipeFn;
};

/**
 * Create a configured pipeline function.
 *
 * When called without an argument it returns the basic `pipe`. If called
 * with `{ bypassNull: true }` it returns `pipeSkipNull`. If a `log`
 * function is provided the returned pipeline will call `log({ value, idx, fnc })`
 * before invoking each step (and in bypass mode it will stop logging once a
 * `null` value is produced).
 */
export const createPipe: createPipeFn = (op?: {
  bypassNull?: true;
  log?: LogFn;
}) => {
  const { bypassNull = false, log = undefined } = op ?? {};

  if (bypassNull && !log) return pipeSkipNull;
  if (bypassNull && log)
    return (...args: ((input: unknown) => unknown)[]) => {
      return (value: unknown) =>
        args.reduce(
          (acc, curr, idx) =>
            acc !== null
              ? (log({ value: acc, idx, fnc: curr }), curr(acc))
              : acc,
          value,
        );
    };
  if (log)
    return (...args: ((input: unknown) => unknown)[]) =>
      (value: unknown) =>
        args.reduce(
          (acc, curr, idx) => (log({ value: acc, idx, fnc: curr }), curr(acc)),
          value,
        );

  return pipe;
};
