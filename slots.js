const {
  geometricHorizontalWordStart,
  geometricVerticalWordStart,
} = require("./helper");

function buildExplicitStarts(grid) {
  const h = grid.length;
  const w = grid[0].length;
  const explicitHStart = new Set();
  const explicitVStart = new Set();

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const cell = grid[i][j];
      if (!/^[1-9]$/.test(cell)) continue;

      const expected = parseInt(cell, 10);
      const gh = geometricHorizontalWordStart(grid, i, j) ? 1 : 0;
      const gv = geometricVerticalWordStart(grid, i, j) ? 1 : 0;
      const base = gh + gv;
      const extendH = j + 1 < w && grid[i][j + 1] !== ".";
      const extendV = i + 1 < h && grid[i + 1][j] !== ".";

      if (expected === base) {
        if (gh) explicitHStart.add(`${i},${j}`);
        if (gv) explicitVStart.add(`${i},${j}`);
      } else if (expected === base + 1 && !gh && extendH) {
        explicitHStart.add(`${i},${j}`);
        if (gv) explicitVStart.add(`${i},${j}`);
      } else if (expected === base + 1 && !gv && extendV && !gh) {
        explicitVStart.add(`${i},${j}`);
      } else {
        return null; // invalid numbered cell
      }
    }
  }

  if (explicitHStart.size === 0 && explicitVStart.size === 0) return null;
  return { explicitHStart, explicitVStart };
}

function buildSlots(grid, explicitHStart, explicitVStart, wordLensSet) {
  const h = grid.length;
  const w = grid[0].length;
  const slots = [];

  function contiguousRowEnd(i, j) {
    let e = j;
    while (e < w && grid[i][e] !== ".") e++;
    return e;
  }

  function contiguousColEnd(i, j) {
    let e = i;
    while (e < h && grid[e][j] !== ".") e++;
    return e;
  }

  function horizontalSlotLen(i, j) {
    const end = contiguousRowEnd(i, j);
    let nextA = null;
    for (let q = j + 1; q < end; q++) {
      if (explicitHStart.has(`${i},${q}`)) {
        nextA = q;
        break;
      }
    }
    if (nextA === null) {
      const len = end - j;
      return wordLensSet.has(len) ? len : null;
    }
    const gap = nextA - j;
    if (wordLensSet.has(gap + 1)) return gap + 1;
    if (wordLensSet.has(gap)) return gap;
    const full = end - j;
    return wordLensSet.has(full) ? full : null;
  }

  function verticalSlotLen(i, j) {
    const end = contiguousColEnd(i, j);
    let nextA = null;
    for (let q = i + 1; q < end; q++) {
      if (explicitVStart.has(`${q},${j}`)) {
        nextA = q;
        break;
      }
    }
    if (nextA === null) {
      const len = end - i;
      return wordLensSet.has(len) ? len : null;
    }
    const gap = nextA - i;
    if (wordLensSet.has(gap + 1)) return gap + 1;
    if (wordLensSet.has(gap)) return gap;
    const full = end - i;
    return wordLensSet.has(full) ? full : null;
  }

  function isStart(i, j, dir) {
    if (grid[i][j] === ".") return false;
    if (dir === "h") {
      if (!(j + 1 < w && grid[i][j + 1] !== ".")) return false;
      if (explicitHStart.has(`${i},${j}`)) return true;
      return j === 0 || grid[i][j - 1] === ".";
    }
    if (!(i + 1 < h && grid[i + 1][j] !== ".")) return false;
    if (explicitVStart.has(`${i},${j}`)) return true;
    return i === 0 || grid[i - 1][j] === ".";
  }

  for (let i = 0; i < h; i++)
    for (let j = 0; j < w; j++)
      if (isStart(i, j, "h")) {
        const len = horizontalSlotLen(i, j);
        if (len !== null) slots.push({ i, j, dir: "h", len });
      }

  for (let j = 0; j < w; j++)
    for (let i = 0; i < h; i++)
      if (isStart(i, j, "v")) {
        const len = verticalSlotLen(i, j);
        if (len !== null) slots.push({ i, j, dir: "v", len });
      }

  return slots;
}

module.exports = { buildExplicitStarts, buildSlots };
