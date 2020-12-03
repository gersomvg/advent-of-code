const {readFileSync} = require('fs');
const {resolve} = require('path')

const numbers = readFileSync(resolve(__dirname, 'numbers.txt'), 'utf8').split('\n').map(Number);

function sum(a,b) { return a + b }

function find2020(list, entryCount, entries = []) {
  const _sum = entries.reduce(sum, 0);
  if (_sum > 2020 || entryCount === entries.length) return _sum === 2020 && entries;
  for (let number of list) {
    const found = find2020(list, entryCount, [...entries, number]);
    if (found) return found;
  }
}

const one = find2020(numbers, 2);
console.log(`Answer part one: ${one[0]} * ${one[1]} = ${one[0] * one[1]}`);

const two = find2020(numbers, 3);
console.log(`Answer part two: ${two[0]} * ${two[1]} * ${two[2]} = ${two[0] * two[1] * two[2]}`);