import { assertSequence, p, o } from "../index";

describe("ordered sequences", () => {
  it("should throw if 'parallel' is a first item", () => {
    expect(() => {
      assertSequence(o(p("apples"), "chicken", "anvil"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Parallel block should follow after simple item");
  });

  it("should throw if no simple item before 'parallel' item", () => {
    expect(() => {
      assertSequence(o("apples", p("chicken"), p("chicken"), "anvil"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Parallel block should follow after simple item");
  });

  it("should throw if 'parallel' item inside 'parallel'", () => {
    expect(() => {
      assertSequence(p(p("apples"), "chicken", "anvil"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Can't have parallel block as direct child of parallel block");
  });

  it("should throw if 'ordered' item inside 'ordered'", () => {
    expect(() => {
      assertSequence(o(o("apples"), "chicken", "anvil"), [
        "apples",
        "chicken",
        "anvil",
      ]);
    }).toThrow("Can't have ordered block as direct child of ordered block");
  });
});
