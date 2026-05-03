# Crossword Solver

This project implements a crossword puzzle solver in JavaScript. The solver receives a puzzle grid and a list of words, then fills the grid with the words when there is exactly one valid solution.

If the input is invalid, if no solution exists, or if more than one solution exists, the program prints:

```text
Error
```

## File Structure

```
crossword-solver/
├── crosswordSolver.js        ← main entry point and orchestrator
├── validation.js             ← input validation (validateParams)
├── helpers.js                ← grid geometry helpers (geometricHorizontalWordStart, geometricVerticalWordStart)
├── slots.js                  ← clue detection and slot building (buildExplicitStarts, buildSlots)
├── backtrack.js              ← placement and backtracking search (canPlace, place, unplace, solve)
├── crosswordSolver.test.js   ← Jest test suite
├── package.json              ← dependencies and test script
└── package-lock.json
```

### File Descriptions

- **`crosswordSolver.js`** — orchestrates the full pipeline: validates input, builds the grid, detects slots, runs the solver, and prints the result.
- **`validation.js`** — rejects invalid inputs early (wrong types, empty values, duplicate words, forbidden characters).
- **`helpers.js`** — two geometry functions that check whether a cell geometrically starts a horizontal or vertical word.
- **`slots.js`** — validates numbered clue cells against the grid geometry, then extracts all horizontal and vertical word slots.
- **`backtrack.js`** — places words into slots with depth-first backtracking, tracks changes for clean undo, and returns the unique solution or `null`.

## Subject Problem

The goal is to solve a crossword-like placement problem.

The puzzle is represented as a string grid:

- `.` represents a blocked cell.
- `0` represents an empty fillable cell.
- `1` or `2` represent clue/start cells (max digit allowed is `2`).
- New lines separate rows.

The words are provided as an array of strings. Each word must be used exactly once, and duplicate words are rejected.

Example puzzle:

```text
2001
0..0
1000
0..0
```

Example words:

```js
["casa", "alan", "ciao", "anta"];
```

Expected output:

```text
casa
i..l
anta
o..n
```

## How To Install And Run Tests

Install dependencies:

```sh
npm install
```

Run the full test suite:

```sh
npm test
```

Run tests for the crossword solver specifically:

```sh
npm test crosswordSolver
```

## How To Use

```js
const crosswordSolver = require("./crosswordSolver");

const puzzle = `2001
0..0
1000
0..0`;

const words = ["casa", "alan", "ciao", "anta"];

crosswordSolver(puzzle, words);
```

Output:

```text
casa
i..l
anta
o..n
```

### package.json

The `package.json` configures Jest as the test runner:

```json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

## Testing With Jest

Tests are written with [Jest](https://jestjs.io/), a JavaScript testing framework that runs test files matching the `*.test.js` pattern.

Each test calls `crosswordSolver()` with a specific input and checks what was printed to `console.log` using a spy (`jest.spyOn`). This means tests verify the printed output directly rather than a return value.

### Error Cases Covered By Tests

- valid simple puzzles
- larger valid puzzles
- duplicate words
- empty puzzle input
- invalid puzzle type
- invalid words type
- puzzles with no solution
- puzzles with multiple solutions
- clue numbers that do not match the grid geometry
- clue digit greater than `2`
- word count not matching slot count

## Public API

The main function is exported from `crosswordSolver.js`:

```js
const crosswordSolver = require("./crosswordSolver");

crosswordSolver(puzzle, words);
```

The function prints the solved crossword using `console.log`. It does not return the solved grid.

## Input Validation

Validation is handled in `validation.js`.

The input is rejected when:

- `puzzle` is not a string.
- `words` is not an array.
- `puzzle` is empty or `words` is empty.
- `words` contains duplicate values.
- `puzzle` contains characters other than `0`, `1`, `2`, `.`, or newlines.
- `puzzle` contains no numbered cell (`1` or `2`).
- any word is not a string or is empty.

## Algorithm Overview

The implementation solves the puzzle in five main steps:

1. Validate the input.
2. Convert the puzzle string into a 2D grid.
3. Validate numbered clue cells and detect word start positions.
4. Extract horizontal and vertical word slots.
5. Use backtracking to place words into the slots.

The solver accepts only puzzles that produce exactly one solution.

## Clue And Slot Detection

Each numbered cell describes how many word starts exist at that position (max `2`: one horizontal and one vertical).

For each numbered cell, the solver checks whether a word can geometrically start:

- **Horizontally**: the cell has a fillable cell to its right, and no fillable cell directly before it in the same row.
- **Vertically**: the cell has a fillable cell below it, and no fillable cell directly above it.

If the digit does not match a valid start configuration, the puzzle is rejected.

After validation, numbered cells are converted to `0` since they are also fillable during solving.

## Slot Length Calculation

A slot is stored as:

```js
{
  (i, j, dir, len);
}
```

- `i` — row index
- `j` — column index
- `dir` — `"h"` for horizontal, `"v"` for vertical
- `len` — required word length

Slots are built directly from `explicitHStart` and `explicitVStart` sets, which already hold all valid starting points — no additional grid scan is needed.

## Backtracking Search

The solver uses depth-first backtracking:

1. Pick the next detected slot.
2. Try every unused word with the matching length.
3. Check whether the word fits (empty cells or matching crossing letters).
4. Place the word temporarily, tracking only changed cells.
5. Recurse into the next slot.
6. Undo only the changed cells if the path fails.

The search stops as soon as a second solution is found.

## Unique Solution Rule

- No solution found → prints `Error`.
- More than one solution found → prints `Error`.
- Exactly one solution found → prints the solved grid.

## Complexity

The algorithm is a backtracking search with worst-case exponential time complexity.

With `S` slots and `W` words, the solver may explore many permutations. The length check and crossing-letter check prune the search space significantly in practice.

Space usage:

- the puzzle grid
- the slots list
- the `used` array
- the recursion stack (depth = number of slots)

## Authors

- **Youness Zarhouni** — yzarhoun
- **Hamza Errabbane** — herrabba
- **Badr Guitoni** — bguitoni
