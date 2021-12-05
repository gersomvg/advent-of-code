const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  const raw = readFileSync(resolve(__dirname, filename), "utf8");
  const draws = raw.split("\n")[0].split(",");
  const boards = raw
    .split("\n\n")
    .slice(1)
    .map((board) =>
      board.split("\n").map((row) => row.split(" ").filter(Boolean))
    );
  return { draws, boards };
}

function boardWins(board, calledSoFar) {
  const columns = board[0].map((_, idx) => board.map((row) => row[idx]));
  return [...board, ...columns].some((line) =>
    line.every((num) => calledSoFar.has(num))
  );
}

function sumUnmarked(board, calledSoFar) {
  const unmarked = [];
  board.forEach((row) =>
    row.forEach((num) => {
      if (!calledSoFar.has(num)) unmarked.push(num);
    })
  );
  return unmarked.reduce((agg, num) => agg + Number(num), 0);
}

function getScoreOfWinningBoard() {
  const { draws, boards } = getInput("input.txt");
  const calledSoFar = new Set();
  for (const draw of draws) {
    calledSoFar.add(draw);
    const winningBoard = boards.find((board) => boardWins(board, calledSoFar));
    if (winningBoard) {
      return sumUnmarked(winningBoard, calledSoFar) * Number(draw);
    }
  }
}

function getScoreOfWorstBoard() {
  const { draws, boards } = getInput("input.txt");
  const calledSoFar = new Set();
  let remainingBoards = [...boards];
  for (const draw of draws) {
    calledSoFar.add(draw);
    if (
      remainingBoards.length === 1 &&
      boardWins(remainingBoards[0], calledSoFar)
    ) {
      return sumUnmarked(remainingBoards[0], calledSoFar) * Number(draw);
    }
    remainingBoards = remainingBoards.filter(
      (board) => !boardWins(board, calledSoFar)
    );
  }
}

function getAnswer1() {
  const score = getScoreOfWinningBoard();
  return score;
}

function getAnswer2() {
  const score = getScoreOfWorstBoard();
  return score;
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
