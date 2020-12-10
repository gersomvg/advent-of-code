const {readFileSync} = require('fs');
const {resolve} = require('path');

const adapters = readFileSync(resolve(__dirname, 'adapters.txt'), 'utf8')
  .split('\n')
  .sort()
  .map(Number);

adapters.sort((a,b) => a-b); // low to high
adapters.unshift(0); // add power outlet
adapters.push(adapters[adapters.length - 1] + 3); // add built-in

function getJoltDiffCounts(_adapters) {
  const {prev, ...counts} =  _adapters.reduce((acc, curr) => {
    const diff = curr - acc.prev;
    if (acc[diff]) {
      acc[diff] += 1;
    } else if (diff > 0) {
      acc[diff] = 1;
    }
    acc.prev = curr;
    return acc;
  }, {prev: 0})
  return counts;
}

const joltDiffCounts = getJoltDiffCounts(adapters);
const answerPartOne = joltDiffCounts['1'] * joltDiffCounts['3'];
console.log(`Answer part one: ${answerPartOne}`);

function countArrangements(_adapters) {
  let chains = _adapters.map(x => 0);
  chains[0] = 1;
  for (var i = 0; i < _adapters.length; i++) {
      for (var j = 0; j < i; j++) {
          if (_adapters[i] - _adapters[j] <= 3) {
              chains[i] += chains[j];
          }
      }
  }
  return chains[_adapters.length - 1];
}

const answerPartTwo = countArrangements(adapters)
console.log(`Answer part one: ${answerPartTwo}`);