const { validateParams } = require("./validation");
const { buildExplicitStarts, buildSlots } = require("./slots");
const { solve } = require("./backtrack");

function crosswordSolver(puzzle, words) {
  if (!validateParams(puzzle, words)) {
    console.log("Error");
    return;
  }

  const grid = puzzle
    .trim()
    .split("\n")
    .map((r) => r.split(""));

  const h = grid.length;
  const w = grid[0].length;

  const starts = buildExplicitStarts(grid);

  console.log(starts);
  if (!starts) {
    console.log("Error");
    return;
  }

  const { explicitHStart, explicitVStart } = starts;

  for (let i = 0; i < h; i++)
    for (let j = 0; j < w; j++)
      if (/^[1-9]$/.test(grid[i][j])) grid[i][j] = "0";

  const wordLensSet = new Set(words.map((w) => w.length));
  const slots = buildSlots(grid, explicitHStart, explicitVStart, wordLensSet);

  if (slots.length === 0 || slots.length !== words.length) {
    console.log("Error");
    return;
  }

  const { solutions, result } = solve(grid, slots, words);

  if (solutions !== 1) {
    console.log("Error");
  } else {
    console.log(result);
  }
}

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
module.exports = crosswordSolver;
