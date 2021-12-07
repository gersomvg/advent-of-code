const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
    .split(',')
    .map(Number);
}

function getFuelNeededForPosition(input, position, transformDiffFunc) {
  return input.reduce(
    (fuel, crab) => (fuel += transformDiffFunc(Math.abs(crab - position))),
    0
  );
}

function getCheapestPosition(input, transformDiffFunc) {
  const lowerCrab = input.reduce((min, crab) => Math.min(min, crab), Infinity);
  const upperCrab = input.reduce((max, crab) => Math.max(max, crab), 0);
  let cheapestPosition = Infinity;
  for (let position = lowerCrab; position <= upperCrab; position += 1) {
    cheapestPosition = Math.min(
      cheapestPosition,
      getFuelNeededForPosition(input, position, transformDiffFunc)
    );
  }
  return cheapestPosition;
}

function getAnswer1() {
  const input = getInput('input.txt');
  return getCheapestPosition(input, (diff) => diff);
}

function getTriangleNumber(num) {
  return (num * (num + 1)) / 2;
}

function getAnswer2() {
  const input = getInput('input.txt');
  return getCheapestPosition(input, getTriangleNumber);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
