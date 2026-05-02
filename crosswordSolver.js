const { validateParams } = require("./parsing");
function crosswordSolver(puzzle, words) {
  // ---------- VALIDATION ----------
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

  // ---------- COUNT WORD STARTS ----------
  function countStarts(i, j) {
    if (grid[i][j] === ".") return 0;

    let count = 0;

    // horizontal start
    if (
      (j === 0 || grid[i][j - 1] === ".") &&
      j + 1 < w &&
      grid[i][j + 1] !== "."
    ) {
      count++;
    }

    // vertical start
    if (
      (i === 0 || grid[i - 1][j] === ".") &&
      i + 1 < h &&
      grid[i + 1][j] !== "."
    ) {
      count++;
    }

    return count;
  }

  // validate clue numbers
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const cell = grid[i][j];
      if (cell !== "." && /[0-9]/.test(cell)) {
        const expected = parseInt(cell, 10);
        const actual = countStarts(i, j);
        if (expected !== actual) {
          console.log("Error");
          return;
        }
      }
    }
  }

  // replace digits with empty usable cells
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (/[0-9]/.test(grid[i][j])) {
        grid[i][j] = "0";
      }
    }
  }

  // ---------- SLOT DETECTION ----------
  const slots = [];

  function isStart(i, j, dir) {
    if (grid[i][j] === ".") return false;

    if (dir === "h") {
      return (
        (j === 0 || grid[i][j - 1] === ".") &&
        j + 1 < w &&
        grid[i][j + 1] !== "."
      );
    } else {
      return (
        (i === 0 || grid[i - 1][j] === ".") &&
        i + 1 < h &&
        grid[i + 1][j] !== "."
      );
    }
  }

  // horizontal slots
  for (let i = 0; i < h; i++) {
    let j = 0;
    while (j < w) {
      if (isStart(i, j, "h")) {
        let len = 0;
        while (j + len < w && grid[i][j + len] !== ".") len++;
        slots.push({ i, j, dir: "h", len });
      }
      j++;
    }
  }

  // vertical slots
  for (let j = 0; j < w; j++) {
    let i = 0;
    while (i < h) {
      if (isStart(i, j, "v")) {
        let len = 0;
        while (i + len < h && grid[i + len][j] !== ".") len++;
        slots.push({ i, j, dir: "v", len });
      }
      i++;
    }
  }

  // ---------- BACKTRACKING ----------
  const used = new Array(words.length).fill(false);
  let solutions = 0;
  let result = null;

  function canPlace(word, slot) {
    const { i, j, dir } = slot;

    for (let k = 0; k < word.length; k++) {
      const r = dir === "h" ? i : i + k;
      const c = dir === "h" ? j + k : j;
      const cell = grid[r][c];

      if (cell !== "0" && cell !== word[k]) return false;
    }

    return true;
  }

  function place(word, slot) {
    const changed = [];
    const { i, j, dir } = slot;

    for (let k = 0; k < word.length; k++) {
      const r = dir === "h" ? i : i + k;
      const c = dir === "h" ? j + k : j;

      if (grid[r][c] === "0") {
        changed.push([r, c]);
        grid[r][c] = word[k];
      }
    }

    return changed;
  }

  function unplace(changed) {
    for (const [r, c] of changed) {
      grid[r][c] = "0";
    }
  }

  function backtrack(idx) {
    if (solutions > 1) return;

    if (idx === slots.length) {
      solutions++;
      result = grid.map((r) => r.join("")).join("\n");
      return;
    }

    const slot = slots[idx];

    for (let w = 0; w < words.length; w++) {
      if (used[w]) continue;
      if (words[w].length !== slot.len) continue;
      if (!canPlace(words[w], slot)) continue;

      used[w] = true;
      const changed = place(words[w], slot);

      backtrack(idx + 1);

      unplace(changed);
      used[w] = false;
    }
  }

  backtrack(0);

  if (solutions !== 1) {
    console.log("Error");
  } else {
    console.log(result);
  }
}
// crosswordSolver("100...10", ["ba", "aab"])

crosswordSolver("", ["a", "b"]);
crosswordSolver("10100", ["aab", "bbb"]);


module.exports = crosswordSolver;
