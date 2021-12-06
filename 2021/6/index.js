const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), "utf8")
    .split(",")
    .map(Number);
}

function getNextTimerCounts(timerCounts) {
  const nextCounts = [...timerCounts];
  const resetCount = nextCounts.shift();
  nextCounts[6] = resetCount + nextCounts[6];
  nextCounts[8] = resetCount;
  return nextCounts;
}

function getCountAfterNDays(day0, days) {
  const counts = Array(9).fill(0);
  day0.forEach((timer) => {
    counts[timer] += 1;
  });
  return [...Array(days)]
    .reduce((countsAgg) => getNextTimerCounts(countsAgg), counts)
    .reduce((a, b) => a + b, 0);
}

function getAnswer1() {
  const input = getInput("input.txt");
  return getCountAfterNDays(input, 80);
}

function getAnswer2() {
  const input = getInput("input.txt");
  return getCountAfterNDays(input, 256);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
