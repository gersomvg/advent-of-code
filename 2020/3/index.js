const {readFileSync} = require('fs');
const {resolve} = require('path')

const lines = readFileSync(resolve(__dirname, 'area.txt'), 'utf8').split('\n');

function getTreeCountForSlope(lines, right, down) {
  let treeCounter = 0;
  for (let depth = 0; depth < lines.length; depth += down) {
    if (lines[depth][((depth / down) * right) % lines[0].length] === '#') treeCounter += 1;
  }
  return treeCounter;
}

const partOneTreeCount = getTreeCountForSlope(lines, 3, 1);
console.log(`Answer part one: ${partOneTreeCount} trees encountered`);

const partTwoTreeCounts = [
  {right: 1, down: 1},
  {right: 3, down: 1},
  {right: 5, down: 1},
  {right: 7, down: 1},
  {right: 1, down: 2},
].map(slope => getTreeCountForSlope(lines, slope.right, slope.down));
function multiply(a,b) { return a * b; }
const partTwoAnswer = partTwoTreeCounts.reduce(multiply, 1);
console.log(`Answer part two: ${partTwoAnswer} trees encountered`);