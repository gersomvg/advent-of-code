const {readFileSync} = require('fs');
const {resolve} = require('path');

const preambleSize = 25;
const xmas = readFileSync(resolve(__dirname, 'xmas.txt'), 'utf8')
  .split('\n')
  .map(Number);
  
function isSumOfTwoOutOfList(number, values) {
  return values.some(_num1 => 
    values.filter(_num2 => _num1 !== _num2).some(_num2 => _num1 + _num2 === number)
  )
}

function getFirstNumberNotSumOfTwoOutOfPreviousN(list, n) {
  return list.find((number, index) => {
    if (index < n) return false;
    return !isSumOfTwoOutOfList(number, list.slice(index - n, index));
  })
}

function getContiguousSetThatSumsUpToNumber(number, list) {
  for (let a = 0; a < list.length - 1; a += 1) {
    let sum = list[a];
    for (let z = a + 1; z < list.length; z += 1) {
      sum += list[z];
      if (sum === number) return list.slice(a, z + 1);
      if (sum > number) break;
    }
  }
}

function min(list) {
  return list.reduce((acc, item) => Math.min(acc, item), Infinity)
}

function max(list) {
  return list.reduce((acc, item) => Math.max(acc, item), -Infinity)
}

const answerPartOne = getFirstNumberNotSumOfTwoOutOfPreviousN(xmas, preambleSize);
console.log(`Answer part one: ${answerPartOne} is the first number that's not a sum`);

const contiguousSet = getContiguousSetThatSumsUpToNumber(answerPartOne, xmas);
const answerPartTwo = min(contiguousSet) + max(contiguousSet);
console.log(`Answer part two: ${answerPartTwo}`);