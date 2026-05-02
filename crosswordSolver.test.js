const crosswordSolver = require("./crosswordSolver");

describe("crosswordSolver", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("basic 4x4 puzzle", () => {
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

  test("big puzzle (valid solution)", () => {
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

    expect(logSpy).toHaveBeenCalled();
  });

  test("reverse words order still valid", () => {
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

    expect(logSpy).toHaveBeenCalled();
  });

  test("invalid duplicate words", () => {
    const puzzle = `2001
0..0
1000
0..0`;

    const words = ["casa", "casa", "ciao", "anta"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("empty puzzle", () => {
    crosswordSolver("", ["a", "b"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("wrong format puzzle", () => {
    crosswordSolver(123, ["a", "b"]);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("wrong format words", () => {
    crosswordSolver("2001\n0..0\n1000\n0..0", 123);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("multiple solutions -> Error", () => {
    const puzzle = `2000
0...
0...
0...`;

    const words = ["abba", "assa"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("no solution -> Error", () => {
    const puzzle = `2001
0..0
1000
0..0`;

    const words = ["aaab", "aaac", "aaad", "aaae"];

    crosswordSolver(puzzle, words);

    expect(logSpy).toHaveBeenCalledWith("Error");
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
});
