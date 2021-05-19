import { assertSequence, o } from "../index";

describe("ordered sequences", () => {
  it("should confirm correct order", () => {
    assertSequence(o("apples", "chicken", "anvil"), [
      "apples",
      "chicken",
      "anvil",
    ]);
  });

  it("should confirm correct order with duplicates", () => {
    assertSequence(o("apples", "chicken", "anvil", "anvil"), [
      "apples",
      "chicken",
      "anvil",
      "anvil",
    ]);
  });

  it("should throw if wrong order", () => {
    expect(() => {
      assertSequence(o("apples", "anvil", "chicken"), [
        "apples",
        "chicken",
        "anvil"
      ]);
    }).toThrow("Wrong order");
  });

  it("should throw if wrong order with duplicates", () => {
    expect(() => {
      assertSequence(o("apples", "chicken", "anvil", "chicken"), [
        "apples",
        "chicken",
        "chicken",
        "anvil"
      ]);
    }).toThrow("Wrong order");
  });

  it("should throw if extra item in graph", () => {
    expect(() => {
      assertSequence(o("apples", "chicken", "anvil", "orange"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Extra item types in graph");
  });

  it("should throw if missing item in graph", () => {
    expect(() => {
      assertSequence(o("apples", "chicken"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Missing item types in graph");
  });
});
