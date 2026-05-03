const { validateParams } = require("./parsing");
const {
  geometricHorizontalWordStart,
  geometricVerticalWordStart,
} = require("./helper");
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
  const gridWidth = grid[0].length;

  const explicitHStart = new Set();
  const explicitVStart = new Set();

  /* validate numbered cells; anchored sets mark where Across/Down slots originate (overlap row/column handled as +1 Across or +1 Down) */
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < gridWidth; j++) {
      const cell = grid[i][j];
      if (!/^[1-9]$/.test(cell)) continue;

      const expected = parseInt(cell, 10);
      const gh = geometricHorizontalWordStart(grid, i, j) ? 1 : 0;
      const gv = geometricVerticalWordStart(grid, i, j) ? 1 : 0;
      const base = gh + gv;

      if (expected === base) {
        if (gh) explicitHStart.add(`${i},${j}`);
        if (gv) explicitVStart.add(`${i},${j}`);
      } else if (expected === base + 1 && !gh) {
        explicitHStart.add(`${i},${j}`);
        if (gv) explicitVStart.add(`${i},${j}`);
      } else if (expected === base + 1 && !gv && !gh) {
        explicitVStart.add(`${i},${j}`);
      } else {
        console.log("Error");
        return;
      }
    }
  }
  if (explicitHStart.size == 0 && explicitVStart.size == 0) {
    console.log("Error");

    return;
  }

  // replace clue digits with empty usable cells (keep playable blanks as "0")
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (/^[1-9]$/.test(grid[i][j])) {
        grid[i][j] = "0";
      }
    }
  }

  // ---------- SLOT DETECTION ----------
  const slots = [];
  const wordLensSet = new Set(words.map((word) => word.length));

  function contiguousRowEnd(i, j) {
    let e = j;
    while (e < gridWidth && grid[i][e] !== ".") e++;
    return e;
  }

  function contiguousColEnd(i, j) {
    let e = i;
    while (e < h && grid[e][j] !== ".") e++;
    return e;
  }

  /** Len of the word starting at (i,j) horizontally: overlaps next numbered clue iff gap + 1 is a word length. */
  function horizontalSlotLen(i, j) {
    const endExclusive = contiguousRowEnd(i, j);
    let nextA = null;
    for (let q = j + 1; q < endExclusive; q++) {
      if (explicitHStart.has(`${i},${q}`)) {
        nextA = q;
        break;
      }
    }
    if (nextA === null) {
      const len = endExclusive - j;
      return wordLensSet.has(len) ? len : null;
    }
    const gap = nextA - j;
    if (wordLensSet.has(gap + 1)) return gap + 1;
    if (wordLensSet.has(gap)) return gap;
    const full = endExclusive - j;
    if (wordLensSet.has(full)) return full;
    return null;
  }

  function verticalSlotLen(i, j) {
    const endExclusive = contiguousColEnd(i, j);
    let nextA = null;
    for (let q = i + 1; q < endExclusive; q++) {
      if (explicitVStart.has(`${q},${j}`)) {
        nextA = q;
        break;
      }
    }
    if (nextA === null) {
      const len = endExclusive - i;
      return wordLensSet.has(len) ? len : null;
    }
    const gap = nextA - i;
    if (wordLensSet.has(gap + 1)) return gap + 1;
    if (wordLensSet.has(gap)) return gap;
    const full = endExclusive - i;
    if (wordLensSet.has(full)) return full;
    return null;
  }

  function isStart(i, j, dir) {
    if (grid[i][j] === ".") return false;

    if (dir === "h") {
      if (!(j + 1 < gridWidth && grid[i][j + 1] !== ".")) return false;
      if (explicitHStart.has(`${i},${j}`)) return true;
      return j === 0 || grid[i][j - 1] === ".";
    }

    if (!(i + 1 < h && grid[i + 1][j] !== ".")) return false;
    if (explicitVStart.has(`${i},${j}`)) return true;
    return i === 0 || grid[i - 1][j] === ".";
  }

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (!isStart(i, j, "h")) continue;
      const len = horizontalSlotLen(i, j);
      if (len === null) continue;
      slots.push({ i, j, dir: "h", len });
    }
  }

  for (let j = 0; j < gridWidth; j++) {
    for (let i = 0; i < h; i++) {
      if (!isStart(i, j, "v")) continue;
      const len = verticalSlotLen(i, j);
      if (len === null) continue;
      slots.push({ i, j, dir: "v", len });
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

    for (let wi = 0; wi < words.length; wi++) {
      if (used[wi]) continue;
      if (words[wi].length !== slot.len) continue;
      if (!canPlace(words[wi], slot)) continue;

      used[wi] = true;
      const changed = place(words[wi], slot);

      backtrack(idx + 1);

      unplace(changed);
      used[wi] = false;
    }
  }

  backtrack(0);

  if (solutions !== 1) {
    console.log("Error");
  } else {
    console.log(result);
  }
}
// const puzzle = `2001
// 0..0
// 1000
// 0..0`;

// const words = ["casa", "alan", "ciao", "anta"];
// crosswordSolver(puzzle, words);
crosswordSolver("100", ["abcd"]);
module.exports = crosswordSolver;
