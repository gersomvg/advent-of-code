const { readFileSync } = require('fs');
const { resolve } = require('path');

function getInput(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
    .split('\n')
    .map((line) => [...line]);
}

const openingChars = '[(<{';
const closingChars = '])>}';

function getFirstIllegalCharacters(input) {
  const illegal = [];
  for (const line of input) {
    const stack = [];
    for (const char of line) {
      if (openingChars.includes(char)) {
        stack.push(closingChars[openingChars.indexOf(char)]);
      } else {
        const expected = stack.pop();
        if (char !== expected) {
          illegal.push(char);
          break;
        }
      }
    }
  }
  return illegal;
}

function scoreIllegalCharacters(chars) {
  const scoreMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };
  return chars.reduce((sum, char) => sum + scoreMap[char], 0);
}

function getAnswer1() {
  const input = getInput('input.txt');

  return scoreIllegalCharacters(getFirstIllegalCharacters(input));
}

function getCompletionChars(input) {
  const complete = [];
  outerloop: for (const line of input) {
    const stack = [];
    for (const char of line) {
      if (openingChars.includes(char)) {
        stack.push(closingChars[openingChars.indexOf(char)]);
      } else {
        const expected = stack.pop();
        if (char !== expected) {
          continue outerloop;
        }
      }
    }
    complete.push(stack.slice().reverse());
  }
  return complete;
}

function getCompletionCharsMiddleScore(complete) {
  const scoreMap = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };
  const scores = complete.map((line) =>
    line.reduce((sum, char) => sum * 5 + scoreMap[char], 0)
  );
  scores.sort((a, b) => a - b);
  return scores[~~(scores.length / 2)];
}

function getAnswer2() {
  const input = getInput('input.txt');
  return getCompletionCharsMiddleScore(getCompletionChars(input));
}

console.log(`Answer part one: ${getAnswer1()}`);

console.log(`Answer part two: ${getAnswer2()}`);
