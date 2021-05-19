import { assertSequence, p } from "../index";

describe("parallel sequences", () => {
  it("should not throw if items match exactly", () => {
    assertSequence(p("apples", "chicken", "anvil"), [
      "apples",
      "chicken",
      "anvil",
    ]);
  });

  it("should not throw if items in different order", () => {
    assertSequence(p("apples", "anvil", "chicken"), [
      "apples",
      "chicken",
      "anvil",
    ]);
  });

  it("should throw if incomplete sequence", () => {
    expect(() => {
      assertSequence(p("apples", "chicken", "anvil", "orange"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Extra item types in graph");
  });

  it("should throw if extra item in sequence", () => {
    expect(() => {
      assertSequence(p("apples", "chicken"), ["apples", "chicken", "anvil"]);
    }).toThrow("Missing item types in graph");
  });

  it("should throw if empty input sequence", () => {
    expect(() => {
      assertSequence(p("apples", "chicken"), []);
    }).toThrow("Extra item types in graph");
  });
});
