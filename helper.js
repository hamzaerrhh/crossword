// ---------- CLUE HELPERS (digits = total orthogonal word starts from that square) ----------
function geometricHorizontalWordStart(grid, i, j) {
  if (!(j + 1 < grid[0].length && grid[i][j + 1] !== ".")) return false;
  return j === 0 || grid[i][j - 1] === ".";
}

// ---------- CLUE HELPERS (digits = total orthogonal word starts from that square) ----------
function geometricVerticalWordStart(grid, i, j) {
  if (!(i + 1 < grid.length && grid[i + 1][j] !== ".")) return false;
  return i === 0 || grid[i - 1][j] === ".";
}

module.exports = { geometricHorizontalWordStart, geometricVerticalWordStart };
