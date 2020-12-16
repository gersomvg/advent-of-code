const {readFileSync} = require('fs');
const {resolve} = require('path');

const numbers = readFileSync(resolve(__dirname, 'numbers.txt'), 'utf8')
  .split(',')
  .map(Number);

function getNthSpokenNumber(n, _numbers) {
  const speakIndexes = new Map();
  let latestNumber = 0;
  let latestNumberTurnsApart = 0;
  function registerSpeak(number, index) {
    const idxs = speakIndexes.get(number);
    if (!idxs) {
      speakIndexes.set(number, [index]);
      latestNumberTurnsApart = 0;
    }
    else {
      latestNumberTurnsApart = index - idxs[idxs.length - 1];
      idxs.push(index);
    }
    latestNumber = number;
  }
  for (let i = 0; i < n; i += 1) {
    if (i < _numbers.length) {
      registerSpeak(_numbers[i], i);
    } else {
      registerSpeak(latestNumberTurnsApart, i);
    }
  }
  return latestNumber;
}

const answerPartOne = getNthSpokenNumber(2020, numbers);
console.log(`Answer part one: ${answerPartOne}`);

const answerPartTwo = getNthSpokenNumber(30000000, numbers);
console.log(`Answer part two: ${answerPartTwo}`);