import { assertSequence, o, p } from "../index";

describe("parallel inside ordered", () => {
  let graph = null;

  beforeEach(() => {
    graph = o(
      "fish",
      "chicken",
      p(
        "hen",
        o(
          "horse",
          "dog"
        ),
        o(
          "cat",
          "tiger"
        )
      )
    );
  });

  [
    ["fish", "chicken", "hen", "horse", "dog", "cat", "tiger"],
    ["fish", "chicken", "hen", "horse", "cat", "dog", "tiger"],
    ["fish", "chicken", "horse", "cat", "dog", "tiger", "hen"]
  ].forEach((seq, i) => {
    it(`should handle valid sequence ${i + 1}`, () => {
      assertSequence(graph, seq);
    });
  });

  [
    ["fish", "chicken", "hen", "horse", "dog", "tiger", "cat"],
    ["chicken", "fish", "hen", "horse", "dog", "cat", "tiger"]
  ].forEach((seq, i) => {
    it(`should throw if invalid sequence ${i + 1}`, () => {
      expect(() => {
        assertSequence(graph, seq);
      }).toThrow("Wrong order");
    });
  });
});

describe("parallel inside ordered, merged into single node", () => {
  let graph = null;

  beforeEach(() => {
    graph = o(
      "fish",
      "chicken",
      p("hen",
        o(
          "horse",
          p(
            "dog",
            "snake"
          )
        ),
        o(
          "cat",
          "tiger"
        )
      ),
      "worm",
      p(
        "rabbit",
        "lion"
      )
    );
  });

  [
    [
      "fish", "chicken", "hen", "horse", "dog", "snake", "cat", "tiger", "worm", "rabbit", "lion"
    ],
    [
      "fish", "chicken", "hen", "horse", "snake", "cat", "dog", "tiger", "worm", "rabbit", "lion"
    ],
    [
      "fish", "chicken", "horse", "cat", "dog", "snake", "tiger", "hen", "worm", "lion", "rabbit"
    ],
  ].forEach((seq, i) => {
    it(`should handle valid sequence ${i + 1}`, () => {
      assertSequence(graph, seq);
    });
  });

  [
    [
      "fish", "chicken", "hen", "horse", "dog", "snake", "tiger", "cat", "worm", "rabbit", "lion"
    ],
    [
      "chicken", "fish", "hen", "horse", "dog", "snake", "cat", "tiger", "worm", "rabbit", "lion"
    ],
  ].forEach((seq, i) => {
    it(`should throw if invalid sequence ${i + 1}`, () => {
      expect(() => {
        assertSequence(graph, seq);
      }).toThrow("Wrong order");
    });
  });
});

describe("parallel inside ordered, duplicates in ordered", () => {
  let graph = null;

  beforeEach(() => {
    graph = o(
      "fish",
      "chicken",
      p(
        "hen",
        o(
          "horse",
          "dog",
          "horse"
        ),
        o(
          "cat",
          "tiger"
        )
      )
    );
  });

  [["fish", "chicken", "hen", "horse", "dog", "horse", "cat", "tiger"]].forEach(
    (seq, i) => {
      it(`should handle valid sequence ${i + 1}`, () => {
        assertSequence(graph, seq);
      });
    }
  );
});

describe("parallel inside ordered, duplicates in parallel", () => {
  let graph = null;

  beforeEach(() => {
    graph = o(
      "fish",
      "chicken",
      p(
        "hen",
        o(
          "horse",
          "dog"
        ),
        o(
          "horse",
          "cat",
          "tiger"
        )
      )
    );
  });

  [["fish", "chicken", "hen", "horse", "dog", "horse", "cat", "tiger"]].forEach(
    (seq, i) => {
      it(`should throw if invalid sequence ${i + 1}`, () => {
        expect(() => {
          assertSequence(graph, seq);
        }).toThrow("Wrong order");
      });
    }
  );
});

describe("ordered inside parallel", () => {
  let graph = null;

  beforeEach(() => {
    graph = p(
      "fish",
      o(
        "chicken",
        "dog"
      ),
      o(
        "hen",
        "cat",
        "tiger"
      )
    );
  });

  [
    ["fish", "chicken", "dog", "hen", "cat", "tiger"],
    ["chicken", "dog", "hen", "cat", "tiger", "fish"],
    ["fish", "chicken", "hen", "dog", "cat", "tiger"],
  ].forEach((seq, i) => {
    it(`should handle valid sequence ${i + 1}`, () => {
      assertSequence(graph, seq);
    });
  });

  [["fish", "chicken", "dog", "hen", "tiger", "cat"]].forEach((seq, i) => {
    it(`should throw if invalid sequence ${i + 1}`, () => {
      expect(() => {
        assertSequence(graph, seq);
      }).toThrow("Wrong order");
    });
  });
});

describe("Extra/missing items", () => {
  it('should throw if extra items graph', () => {
    const graph = o(
      1,
      p(
        o(
          2,
          5
        ),
        o(
          3,
          5
        ),
        o(
          4,
          5
        )
      )
    );
    expect(() => {
      assertSequence(graph, [1, 2, 3, 4, 5]);
    }).toThrow("Extra items in graph");
  });

  it('should throw if missing items graph', () => {
    const graph = o(
      1,
      p(
        o(
          2,
          5
        ),
        o(
          3,
          5
        ),
        o(
          4,
          5
        )
      )
    );
    expect(() => {
      assertSequence(graph, [1, 2, 3, 4, 5, 5, 5, 5]);
    }).toThrow("Missing items in graph");
  });
});
