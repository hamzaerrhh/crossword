const validateParams = (puzzle, words) => {
  if (typeof puzzle !== "string" || !Array.isArray(words)) return false;
  if (puzzle.length === 0 || words.length === 0) return false;
  if (new Set(words).size !== words.length) return false;
  if (!/^[0-9.\n]+$/.test(puzzle)) return false;
  if (!/[1-9]/.test(puzzle)) return false;
  for (const w of words) {
    if (typeof w !== "string" || w === "") return false;
  }
  return true;
};

module.exports = { validateParams };
