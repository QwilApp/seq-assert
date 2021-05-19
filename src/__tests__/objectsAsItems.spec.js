import { assertSequence, o } from "../index";

describe("objects as items", () => {
  it("should confirm correct order", () => {
    assertSequence(o({ a: 1, c: { w: 2 } }, { b: 1 }, { e: 3 }), [
      { a: 1, c: { w: 2, w2: 2 }, a1: 2 },
      { b: 1 },
      { e: 3, e2: 4 },
    ]);
  });

  it("should throw if graph item doesn't match seq items (updated prop)", () => {
    expect(() => {
      assertSequence(o({ a: 1, c: { w: 3 } }, { b: 1 }, { e: 3 }), [
        { a: 1, c: { w: 2, w2: 2 }, a1: 2 },
        { b: 1 },
        { e: 3, e2: 4 },
      ]);
    }).toThrow("Extra item types in graph");
  });

  it("should throw if graph item doesn't match seq items (extra prop)", () => {
    expect(() => {
      assertSequence(o({ a: 1, c: { w: 2, w3: 3 } }, { b: 1 }, { e: 3 }), [
        { a: 1, c: { w: 2, w2: 2 }, a1: 2 },
        { b: 1 },
        { e: 3, e2: 4 },
      ]);
    }).toThrow("Extra item types in graph");
  });
});
