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

crosswordSolver("10a0", ["ab", "cd"]);

module.exports = crosswordSolver;
