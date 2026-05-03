const crosswordSolver = require("./crosswordSolver");

describe("AUDIT TESTS", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("AUDIT 1 --> basic 4x4 puzzle", () => {
    const puzzle = `2001
0..0
1000
0..0`;

    const words = ["casa", "alan", "ciao", "anta"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith(
      `casa
i..l
anta
o..n`,
    );
  });
  test("AUDIT 2 --> big puzzle (valid solution)", () => {
    const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`;

    const words = [
      "sun",
      "sunglasses",
      "suncream",
      "swimming",
      "bikini",
      "beach",
      "icecream",
      "tan",
      "deckchair",
      "sand",
      "seaside",
      "sandals",
    ];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith(
      `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`,
    );
  });
  test("AUDIT 3 --> food puzzle", () => {
    const puzzle = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`;

    const words = [
      "popcorn",
      "fruit",
      "flour",
      "chicken",
      "eggs",
      "vegetables",
      "pasta",
      "pork",
      "steak",
      "cheese",
    ];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith(
      `..p.f..v...
flour..eggs
..p.u..g...
..chicken..
..o.t..t...
pork..pasta
..n.s..b...
....t..l...
..cheese...
....a..s...
....k......`,
    );
  });
  test("AUDIT 4 --> big puzzle (valid solution)", () => {
    const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`;

    const words = [
      "sun",
      "sunglasses",
      "suncream",
      "swimming",
      "bikini",
      "beach",
      "icecream",
      "tan",
      "deckchair",
      "sand",
      "seaside",
      "sandals",
    ].reverse();

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith(
      `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`,
    );
  });
  test("AUDIT 5 --> invalid duplicate words", () => {
    const puzzle = `2001
0..0
1000
0..0`;

    const words = ["casa", "casa", "ciao", "anta"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
  test("AUDIT 6 --> test starting words higher than 2", () => {
    const puzzle = "0001\n0..0\n3000\n0..0";
    const words = ["casa", "alan", "ciao", "anta"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
  test("AUDIT 7 --> Test words repetition", () => {
    const puzzle = "2001\n0..0\n1000\n0..0";
    const words = ["casa", "casa", "ciao", "anta"];
    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("AUDIT 8 --> empty puzzle", () => {
    const puzzle = "";
    const words = ["casa", "alan", "ciao", "anta"];
    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("AUDIT 9 --> wrong format puzzle", () => {
    const puzzle = 123;
    const words = ["casa", "alan", "ciao", "anta"];
    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
  test("AUDIT 10  --> Test wrong format checks", () => {
    const puzzle = "";
    const words = 123;
    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("AUDIT 11  --> Test multiple solutions", () => {
    const puzzle = "2000\n0...\n0...\n0...";
    const words = ["abba", "assa"];
    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("AUDIT 12  --> Test no solution", () => {
    const puzzle = `2001
0..0
1000
0..0`;

    const words = ["aaab", "aaac", "aaad", "aaae"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
});

describe("RANDOM TESTS", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("invalid clue mismatch -> Error", () => {
    const puzzle = `2001
0..0
2000
0..0`;

    const words = ["casa", "alan", "ciao", "anta"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("clue too high -> Error", () => {
    const puzzle = `0001
0..0
3000
0..0`;

    const words = ["casa", "alan", "ciao", "anta"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
  test("empty words array -> Error", () => {
    crosswordSolver("100", []);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("words contains empty string -> Error", () => {
    crosswordSolver("100", [""]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("not enough words -> Error", () => {
    crosswordSolver("10100", ["abc"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("too many words -> Error", () => {
    crosswordSolver("100", ["ab", "cd"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("word does not fit slot length -> Error", () => {
    crosswordSolver("100", ["abcd"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("single letter slot should be invalid -> Error", () => {
    const puzzle = `1..
...`;

    const words = ["ab"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("puzzle with only walls -> Error", () => {
    crosswordSolver("...\n...\n...", ["abc"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("no starting points but words provided -> Error", () => {
    crosswordSolver("000", ["abc"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("words contain non-string -> Error", () => {
    crosswordSolver("100", ["abc", 123]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("invalid puzzle characters -> Error", () => {
    crosswordSolver("10a0", ["ab", "cd"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
  test("simple linear puzzle", () => {
    crosswordSolver("10100", ["aab", "bbb"]);

    expect(logSpy).toHaveBeenCalledWith("aabbb");
  });

  test("overlapping letters mismatch -> Error", () => {
    crosswordSolver("10100", ["abc", "ddd"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
});
