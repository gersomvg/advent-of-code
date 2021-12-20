const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  const parts = readFileSync(resolve(__dirname, filename), 'utf8').split(
    '\n\n'
  );
  const paper = parts[0].split('\n').map((line) => line.split(',').map(Number));
  const folds = parts[1]
    .split('\n')
    .map((line) => line.replace('fold along ', '').split('='))
    .map((fold) => {
      fold[1] = Number(fold[1]);
      return fold;
    });
  return { paper, folds };
}

function foldPaper(paper, fold) {
  return paper
    .filter((dot) => fold[1] !== dot[fold[0] === 'x' ? 0 : 1])
    .map((dot) => {
      if (fold[1] > dot[fold[0] === 'x' ? 0 : 1]) return dot;
      return fold[0] === 'x'
        ? [fold[1] - (dot[0] - fold[1]), dot[1]]
        : [dot[0], fold[1] - (dot[1] - fold[1])];
    });
}

function countDots(paper) {
  return new Set(paper.map(([x, y]) => `${x},${y}`)).size;
}

function drawPaper(paper) {
  const [width, height] = paper.reduce(
    (dim, dot) => [Math.max(dim[0], dot[0] + 1), Math.max(dim[1], dot[1] + 1)],
    [0, 0]
  );
  const map = paper.reduce(
    (agg, dot) => {
      agg[dot[1]][dot[0]] = '#';
      return agg;
    },
    Array(height)
      .fill()
      .map(() => Array(width).fill('.'))
  );
  console.log(map.map((line) => line.join(' ')).join('\n'));
}

function getAnswer1() {
  const { paper, folds } = getInput('input.txt');
  const folded = foldPaper(paper, folds[0]);
  return countDots(folded);
}

function getAnswer2() {
  const input = getInput('input.txt');
  const { paper, folds } = getInput('input.txt');
  const endFold = folds.reduce((paper, fold) => foldPaper(paper, fold), paper);
  drawPaper(endFold);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
