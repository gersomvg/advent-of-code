const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
    .split('\n')
    .map((line) => line.split('').map(Number));
}

function getLowPoints(input) {
  const lowPoints = [];
  for (let x = 0; x < input[0].length; x += 1) {
    for (let y = 0; y < input.length; y += 1) {
      if (
        [
          input[y - 1]?.[x],
          input[y]?.[x + 1],
          input[y + 1]?.[x],
          input[y]?.[x - 1],
        ].every((point) => typeof point === 'undefined' || point > input[y][x])
      ) {
        lowPoints.push(input[y][x]);
      }
    }
  }
  return lowPoints;
}

function getSumOfRiskLevels(lowPoints) {
  return lowPoints.reduce((a, b) => a + b + 1, 0);
}

function getAnswer1() {
  const input = getInput('input.txt');
  const lowPoints = getLowPoints(input);
  const sumOfRiskLevels = getSumOfRiskLevels(lowPoints);
  return sumOfRiskLevels;
}

function getBasinSizes(input) {
  const basins = [];

  const getBasinByLoc = (x, y) =>
    basins.find((basin) => basin.includes(`${x},${y}`));

  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[0].length; x += 1) {
      if (input[y][x] === 9) continue;
      const leftBasin = getBasinByLoc(x - 1, y);
      const topBasin = getBasinByLoc(x, y - 1);
      if (!leftBasin && !topBasin) {
        basins.push([`${x},${y}`]);
      }
      if (leftBasin) {
        leftBasin.push(`${x},${y}`);
      } else if (topBasin) {
        topBasin.push(`${x},${y}`);
      }
      if (topBasin && leftBasin && topBasin !== leftBasin) {
        topBasin.push(...leftBasin);
        basins.splice(basins.indexOf(leftBasin), 1);
      }
    }
  }
  return basins.map((basin) => basin.length);
}

function multiplyThreeBiggest(basinSizes) {
  const desc = basinSizes.slice().sort((a, b) => b - a);
  return desc[0] * desc[1] * desc[2];
}

function getAnswer2() {
  const input = getInput('input.txt');
  const basinSizes = getBasinSizes(input);
  return multiplyThreeBiggest(basinSizes);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
