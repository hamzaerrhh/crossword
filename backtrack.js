function canPlace(grid, word, slot) {
  const { i, j, dir } = slot;
  for (let k = 0; k < word.length; k++) {
    const r = dir === "h" ? i : i + k;
    const c = dir === "h" ? j + k : j;
    if (grid[r][c] !== "0" && grid[r][c] !== word[k]) return false;
  }
  return true;
}

function place(grid, word, slot) {
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

function unplace(grid, changed) {
  for (const [r, c] of changed) grid[r][c] = "0";
}

function solve(grid, slots, words) {
  const used = new Array(words.length).fill(false);
  console.log(used, words);
  let solutions = 0;
  let result = null;

  function backtrack(idx) {
    if (solutions > 1) return;

    if (idx === slots.length) {
      solutions++;
      result = grid.map((r) => r.join("")).join("\n");
      return;
    }
    const slot = slots[idx];

    for (let wi = 0; wi < words.length; wi++) {
      if (
        used[wi] ||
        words[wi].length !== slot.len ||
        !canPlace(grid, words[wi], slot)
      ) {
        continue;
      }
      used[wi] = true;
      const changed = place(grid, words[wi], slot);
      backtrack(idx + 1);
      unplace(grid, changed);
      used[wi] = false;
    }
  }

  backtrack(0);
  return solutions === 1 ? result : null;
}

module.exports = { solve };
