import { describe, expect, it, vi } from "vitest";
import { createPipe, pipe, pipeFrom, pipeSkipNull } from "./../src";

type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

describe("pipe", () => {
  it("composes functions left-to-right", () => {
    const inc = (x: number) => x + 1;
    const dbl = (x: number) => x * 2;

    const piped = pipe(inc, dbl);

    const result = piped(2);

    type test = Expect<Equal<typeof result, number>>;
    expect(result).toBe(6); // (2 + 1) * 2
  });
});

describe("pipeSkipNull", () => {
  it("bypasses subsequent operations when a step returns null", () => {
    const toOne = (x: number) => 1;
    const toNull = (_: number) => null as null;
    const shouldNotBeCalled = vi.fn((x: unknown) => {
      // if called, return a sentinel
      return "called";
    });

    const runner = pipeSkipNull(toOne, toNull, shouldNotBeCalled);
    const result = runner(10);

    type test = Expect<Equal<typeof result, string | null>>;
    expect(result).toBeNull();
    expect(shouldNotBeCalled).not.toHaveBeenCalled();
  });

  it("passes through values when no nulls produced", () => {
    const a = (n: number) => n + 2;
    const b = (n: number) => n * 3;

    const runner = pipeSkipNull(a, b);

    const result = runner(1);

    type test = Expect<Equal<typeof result, number>>;
    expect(runner(1)).toBe(9); // (1 + 2) * 3
  });
});

describe("pipeFrom", () => {
  it("composes functions left-to-right", () => {
    const inc = (x: number) => x + 1;
    const dbl = (x: number) => x * 2;

    const piped = pipeFrom(2)(inc, dbl);

    type test = Expect<Equal<typeof piped, number>>;
    expect(piped).toBe(6); // (2 + 1) * 2
  });

  it("composes inline functions left-to-right", () => {
    const piped = pipeFrom(2)(
      (x) => x + 1,
      (x) => x * 2,
      String,
      Number,
    );

    type test = Expect<Equal<typeof piped, number>>;
    expect(piped).toBe(6); // (2 + 1) * 2
  });

  it("bypasses subsequent operations when a step returns null", () => {
    const shouldNotBeCalled = vi.fn((x: unknown) => {
      // if called, return a sentinel
      return "called";
    });

    const result = pipeFrom(10, { bypassNull: true })(
      () => 1,
      () => null,
      shouldNotBeCalled,
    );

    type test = Expect<Equal<typeof result, string | null>>;
    expect(result).toBeNull();
    expect(shouldNotBeCalled).not.toHaveBeenCalled();
  });

  it("longer pipe", () => {
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
      },
    );

    type test = Expect<Equal<typeof result, number>>;
    expect(result).toEqual(102);
  });
});

describe("createPipe", () => {
  it("returns the default pipe when no options provided", () => {
    const p = createPipe();
    const result = p((x: number) => x + 1)(5);

    type test = Expect<Equal<typeof result, number>>;
    expect(result).toBe(6);
  });

  it("returns pipeSkipNull when bypassNull is true", () => {
    const p = createPipe({ bypassNull: true });
    const toNull = (_: number) => null as null;
    const runner = p((_n: unknown) => 1, toNull);

    const result = runner(5);

    type test = Expect<Equal<typeof result, null>>;
    expect(runner(5)).toBeNull();
  });

  it("calls provided log function for each step (normal pipe)", () => {
    const log = vi.fn();
    const p = createPipe({ log: log });
    const inc = (n: number) => n + 1;
    const dbl = (n: number) => n * 2;

    const runner = p(inc, dbl);
    const res = runner(3);

    type test = Expect<Equal<typeof res, number>>;

    expect(res).toBe(8);
    // log should be called twice: before inc (idx 0) and before dbl (idx 1)
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0][0]).toHaveProperty("value", 3);
    expect(log.mock.calls[0][0]).toHaveProperty("idx", 0);
    expect(typeof log.mock.calls[0][0].fnc).toBe("function");
  });

  it("calls log only while value is not null for bypass mode", () => {
    const log = vi.fn();
    const p = createPipe({ bypassNull: true, log: log });

    const a = (_: number) => 1;
    const toNull = (_: number) => null as null | number;
    const shouldNotBeCalled = vi.fn((x: null | number) => x);

    const runner = p(a, toNull, shouldNotBeCalled);
    const res = runner(10);

    type test = Expect<Equal<typeof res, number | null>>;

    expect(res).toBeNull();
    // log should be called only for a and toNull (but not for shouldNotBeCalled)
    expect(log).toHaveBeenCalledTimes(2);
    expect(shouldNotBeCalled).not.toHaveBeenCalled();
  });
});
