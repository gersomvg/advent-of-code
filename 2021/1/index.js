const { readFileSync } = require("fs");
const { resolve } = require("path");

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), "utf8").split("\n");
}

function getDepthIncreaseCount(depths) {
  let lastDepth = null;
  let count = 0;
  depths.forEach((depth) => {
    if (lastDepth != null && depth > lastDepth) count += 1;
    lastDepth = depth;
  });
  return count;
}

function getAnswer1() {
  const depths = getInput("input.txt").map(Number);
  return getDepthIncreaseCount(depths);
}

function getSweepDepth(sweep) {
  return Number(sweep.split(" ")[0]);
}

function getAnswer2() {
  const depths = getInput("input.txt");
  const threeMeasDepths = depths.reduce((agg, depth, index) => {
    if (!depths[index + 2]) return agg;
    const aggDepth =
      getSweepDepth(depth) +
      getSweepDepth(depths[index + 1]) +
      getSweepDepth(depths[index + 2]);
    agg.push(aggDepth);
    return agg;
  }, []);
  return getDepthIncreaseCount(threeMeasDepths);
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
