const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), "utf8").split("\n");
}

function getAnswer1() {
  const input = getInput("input.txt");
  return "Implement me";
}

function getAnswer2() {
  const input = getInput("input.txt");
  return "Implement me";
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
