const {
  geometricHorizontalWordStart,
  geometricVerticalWordStart,
} = require("./helper");

/**
 * get the starting points (verts and horizo)
 */
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

  function slotLen(i, j, dir) {
    const isH = dir === "h";
    const limit = isH ? w : h;
    const starts = isH ? explicitHStart : explicitVStart;

    let end = isH ? j : i;
    while (end < limit && grid[isH ? i : end][isH ? end : j] !== ".") end++;

    let next = null;
    const from = isH ? j : i;
    for (let q = from + 1; q < end; q++) {
      const key = isH ? `${i},${q}` : `${q},${j}`;
      if (starts.has(key)) {
        next = q;
        break;
      }
    }

    if (next === null) {
      const len = end - from;
      return wordLensSet.has(len) ? len : null;
    }

    const gap = next - from;
    if (wordLensSet.has(gap + 1)) return gap + 1;
    if (wordLensSet.has(gap)) return gap;
    const full = end - from;
    return wordLensSet.has(full) ? full : null;
  }

  for (const key of explicitHStart) {
    const [i, j] = key.split(",").map(Number);
    const len = slotLen(i, j, "h");
    if (len !== null) slots.push({ i, j, dir: "h", len });
  }

  for (const key of explicitVStart) {
    const [i, j] = key.split(",").map(Number);
    const len = slotLen(i, j, "v");
    if (len !== null) slots.push({ i, j, dir: "v", len });
  }

  return slots;
}

module.exports = { buildExplicitStarts, buildSlots };
