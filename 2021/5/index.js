const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  const raw = readFileSync(resolve(__dirname, filename), "utf8").split("\n");
  return raw.map((line) =>
    line.split(" -> ").map((pos) => pos.split(",").map((num) => Number(num)))
  );
}

function addLineToMap(map, line) {
  const xSign = Math.sign(line[1][0] - line[0][0]);
  const ySign = Math.sign(line[1][1] - line[0][1]);
  const diff = Math.max(
    Math.abs(line[1][0] - line[0][0]),
    Math.abs(line[1][1] - line[0][1])
  );
  for (let n = 0; n <= diff; n++) {
    const x = xSign === 0 ? line[0][0] : line[0][0] + n * xSign;
    const y = ySign === 0 ? line[0][1] : line[0][1] + n * ySign;
    map[x] = { ...map[x], [y]: (map[x]?.[y] || 0) + 1 };
  }
  return map;
}

function countPointsWithOverlap(map) {
  return Object.values(map)
    .map((row) => Object.values(row))
    .flat()
    .filter((num) => num > 1).length;
}

function lineIsNotDiagonal(line) {
  return line[0][0] === line[1][0] || line[0][1] === line[1][1];
}

function getAnswer1() {
  const input = getInput("input.txt");
  const map = input.reduce(
    (mapAgg, line) =>
      lineIsNotDiagonal(line) ? addLineToMap(mapAgg, line) : mapAgg,
    {}
  );
  return countPointsWithOverlap(map);
}

function getAnswer2() {
  const input = getInput("input.txt");
  const map = input.reduce((mapAgg, line) => addLineToMap(mapAgg, line), {});
  return countPointsWithOverlap(map);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
