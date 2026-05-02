const crosswordSolver = require("./crosswordSolver");

describe("crosswordSolver", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("basic 4x4 puzzle (exact output)", () => {
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

  test("third sample puzzle (README case)", () => {
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

  test("invalid duplicate words", () => {
    crosswordSolver(
      `2001
0..0
1000
0..0`,
      ["casa", "casa", "ciao", "anta"],
    );

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
    crosswordSolver(
      `2000
0...
0...
0...`,
      ["abba", "assa"],
    );

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("no solution -> Error", () => {
    crosswordSolver(
      `2001
0..0
1000
0..0`,
      ["aaab", "aaac", "aaad", "aaae"],
    );

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("invalid clue mismatch -> Error", () => {
    crosswordSolver(
      `2001
0..0
2000
0..0`,
      ["casa", "alan", "ciao", "anta"],
    );

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
  test("invalid duplicate words", () => {
    crosswordSolver(
      `2001
0..0
1000
0..0`,
      ["casa", "casa", "ciao", "anta"],
    );

    expect(logSpy).toHaveBeenCalledWith("Error");
  });

  test("clue too high -> Error", () => {
    crosswordSolver(
      `0001
0..0
3000
0..0`,
      ["casa", "alan", "ciao", "anta"],
    );

    expect(logSpy).toHaveBeenCalledWith("Error");
  });
});
